// routes/forumRouter.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ukm_registration'
});


async function getNestedReplies(parentId) {
  const [replies] = await pool.execute(
    'SELECT * FROM forum_replies WHERE parent_reply_id = ? ORDER BY created_at ASC',
    [parentId]
  );
  for (const reply of replies) {
    reply.replies = await getNestedReplies(reply.id);
  }
  return replies;
}

// Halaman utama forum
router.get('/', async (req, res) => {
  try {
    const [discussions] = await pool.execute(
      'SELECT * FROM forum_discussions ORDER BY created_at DESC'
    );
    for (const discussion of discussions) {
      const [replies] = await pool.execute(
        'SELECT * FROM forum_replies WHERE discussion_id = ? AND parent_reply_id IS NULL ORDER BY created_at ASC',
        [discussion.id]
      );
      for (const reply of replies) {
        reply.replies = await getNestedReplies(reply.id);
      }
      discussion.replies = replies;
    }
    res.render('forum', { discussions, layout: false });
  } catch (err) {
    console.error('❌ Error load forum:', err);
    res.status(500).send('Gagal memuat forum');
  }
});

// Implementasi baru: Search di diskusi & balasan
router.get('/search', async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.redirect('/forum');
  const likePattern = `%${keyword}%`;

  try {
    const [discMatches] = await pool.execute(
      `SELECT * FROM forum_discussions WHERE content LIKE ? OR author LIKE ? ORDER BY created_at DESC`,
      [likePattern, likePattern]
    );
    const [replyMatches] = await pool.execute(
      `SELECT * FROM forum_replies WHERE content LIKE ? OR author LIKE ?`,
      [likePattern, likePattern]
    );
    const discussionIds = new Set();
    discMatches.forEach(d => discussionIds.add(d.id));
    replyMatches.forEach(r => discussionIds.add(r.discussion_id));
    const idsArr = Array.from(discussionIds);

    let discussions = [];
    if (idsArr.length) {
      const placeholders = idsArr.map(() => '?').join(',');
      const [rows] = await pool.execute(
        `SELECT * FROM forum_discussions WHERE id IN (${placeholders}) ORDER BY created_at DESC`,
        idsArr
      );
      discussions = rows;
    }

    for (const discussion of discussions) {
      const [replies] = await pool.execute(
        `SELECT * FROM forum_replies
         WHERE discussion_id = ?
           AND (content LIKE ? OR author LIKE ?)
         ORDER BY created_at ASC`,
        [discussion.id, likePattern, likePattern]
      );
      for (const reply of replies) {
        reply.replies = await getNestedReplies(reply.id);
      }
      discussion.replies = replies;
    }

    res.render('forum', { discussions, layout: false, search: keyword });
  } catch (err) {
    console.error('❌ Error saat pencarian diskusi+balasan:', err);
    res.status(500).send('Terjadi kesalahan saat mencari komentar & balasan');
  }
});

// Post komentar baru
router.post('/message', async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) return res.status(400).send('Nama dan pesan tidak boleh kosong');
  try {
    await pool.execute(
      `INSERT INTO forum_discussions (title, content, author, category, likes, replies_count)
       VALUES (?, ?, ?, ?, 0, 0)`,
      [`Komentar dari ${user}`, text, user, 'Umum']
    );
    res.redirect('/forum');
  } catch (err) {
    console.error('❌ Gagal menyimpan komentar:', err);
    res.status(500).send('Terjadi kesalahan saat menyimpan komentar');
  }
});

// Toggle Like Diskusi
router.post('/discussion/:id/like', async (req, res) => {
  const discussionId = parseInt(req.params.id);
  const ip = req.ip;
  try {
    const [[existing]] = await pool.execute(
      `SELECT 1 FROM discussion_likes WHERE discussion_id = ? AND ip_address = ?`,
      [discussionId, ip]
    );
    if (existing) {
      await pool.execute(
        `DELETE FROM discussion_likes WHERE discussion_id = ? AND ip_address = ?`,
        [discussionId, ip]
      );
      await pool.execute(
        `UPDATE forum_discussions SET likes = likes - 1 WHERE id = ? AND likes > 0`,
        [discussionId]
      );
    } else {
      await pool.execute(
        `INSERT INTO discussion_likes (discussion_id, ip_address) VALUES (?, ?)`,
        [discussionId, ip]
      );
      await pool.execute(
        `UPDATE forum_discussions SET likes = likes + 1 WHERE id = ?`,
        [discussionId]
      );
    }
    res.redirect(req.get('Referer') || '/forum');
  } catch (err) {
    console.error('❌ Gagal toggle like diskusi:', err);
    res.status(500).send('Gagal memproses like diskusi');
  }
});

// Delete komentar
router.delete('/discussion/:id', async (req, res) => {
  const discussionId = parseInt(req.params.id);
  try {
    await pool.execute(`DELETE FROM forum_discussions WHERE id = ?`, [discussionId]);
    await pool.execute(`DELETE FROM forum_replies WHERE discussion_id = ?`, [discussionId]);
    res.redirect('/forum');
  } catch (err) {
    console.error('❌ Gagal hapus komentar:', err);
    res.status(500).send('Gagal menghapus komentar');
  }
});

// Balas komentar
router.post('/discussion/:id/reply', async (req, res) => {
  const discussionId = parseInt(req.params.id);
  const { author, content } = req.body;
  if (!author || !content) return res.status(400).send('Nama dan isi balasan tidak boleh kosong');
  try {
    await pool.execute(
      `INSERT INTO forum_replies (discussion_id, author, content) VALUES (?, ?, ?)`,
      [discussionId, author, content]
    );
    await pool.execute(
      `UPDATE forum_discussions SET replies_count = replies_count + 1 WHERE id = ?`,
      [discussionId]
    );
    res.redirect('/forum');
  } catch (err) {
    console.error('❌ Gagal menyimpan balasan:', err);
    res.status(500).send('Gagal menyimpan balasan');
  }
});

// Toggle Like Reply
router.post('/reply/:id/like', async (req, res) => {
  const replyId = parseInt(req.params.id);
  const ip = req.ip;
  try {
    const [[existing]] = await pool.execute(
      `SELECT 1 FROM reply_likes WHERE reply_id = ? AND ip_address = ?`,
      [replyId, ip]
    );
    if (existing) {
      await pool.execute(
        `DELETE FROM reply_likes WHERE reply_id = ? AND ip_address = ?`,
        [replyId, ip]
      );
      await pool.execute(
        `UPDATE forum_replies SET likes = likes - 1 WHERE id = ? AND likes > 0`,
        [replyId]
      );
    } else {
      await pool.execute(
        `INSERT INTO reply_likes (reply_id, ip_address) VALUES (?, ?)`,
        [replyId, ip]
      );
      await pool.execute(
        `UPDATE forum_replies SET likes = likes + 1 WHERE id = ?`,
        [replyId]
      );
    }
    res.redirect(req.get('Referer') || '/forum');
  } catch (err) {
    console.error('❌ Gagal toggle like balasan:', err);
    res.status(500).send('Gagal memproses like balasan');
  }
});

// Delete reply
router.delete('/reply/:id', async (req, res) => {
  const replyId = parseInt(req.params.id);
  try {
    await pool.execute(`DELETE FROM forum_replies WHERE id = ?`, [replyId]);
    res.redirect('/forum');
  } catch (err) {
    console.error('❌ Gagal hapus balasan:', err);
    res.status(500).send('Gagal menghapus balasan');
  }
});

// Balas ke reply (nested)
router.post('/reply/:id/reply', async (req, res) => {
  const parentReplyId = parseInt(req.params.id);
  const { author, content, discussionId } = req.body;
  if (!author || !content) return res.status(400).send('Nama dan isi balasan tidak boleh kosong');
  try {
    await pool.execute(
      `INSERT INTO forum_replies (discussion_id, parent_reply_id, author, content) VALUES (?, ?, ?, ?)`,
      [discussionId, parentReplyId, author, content]
    );
    await pool.execute(
      `UPDATE forum_discussions SET replies_count = replies_count + 1 WHERE id = ?`,
      [discussionId]
    );
    res.redirect('/forum');
  } catch (err) {
    console.error('❌ Gagal menyimpan nested balasan:', err);
    res.status(500).send('Gagal menyimpan balasan');
  }
});

module.exports = router;
