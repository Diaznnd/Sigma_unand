const express = require('express');
const router = express.Router();
const { Kegiatan, Organisasi } = require('../models');

// Route untuk halaman kalender: /user/kalender
router.get('/kalender', (req, res) => {
  res.render('user/kalender');
});

// Route untuk data kalender: /user/kalender/data
router.get('/kalender/data', async (req, res) => {
  try {
    console.log('=== Fetching calendar data ===');
    
    // Coba ambil data kegiatan dengan cara sederhana dulu
    const kegiatan = await Kegiatan.findAll({
      order: [['tanggal', 'ASC']]
    });
    
    console.log('Found kegiatan:', kegiatan.length);
    
    // Coba ambil organisasi
    const organisasi = await Organisasi.findAll();
    console.log('Found organisasi:', organisasi.length);
    
    // Buat mapping organisasi
    const orgMap = {};
    organisasi.forEach(org => {
      // Cek field mana yang ada
      const namaOrg = org.nama || org.namaOrg || org.name || `UKM-${org.id}`;
      orgMap[org.id] = namaOrg;
      console.log(`Org ${org.id}: ${namaOrg}`);
    });
    
    const events = kegiatan.map(k => {
      console.log(`Processing kegiatan ${k.id}: ${k.judul}, ukm_id: ${k.ukm_id}`);
      
      // Format tanggal
      let formattedDate;
      try {
        const tanggal = new Date(k.tanggal);
        if (isNaN(tanggal.getTime())) {
          throw new Error('Invalid date');
        }
        formattedDate = tanggal.toISOString().split('T')[0];
      } catch (dateError) {
        console.error('Date error for kegiatan', k.id, ':', dateError);
        formattedDate = new Date().toISOString().split('T')[0];
      }
      
      // Cari nama UKM
      const namaUKM = orgMap[k.ukm_id] || 'UKM Tidak Diketahui';
      
      const event = {
        title: k.judul || 'Kegiatan Tanpa Judul',
        start: formattedDate,
        extendedProps: {
          ukm: namaUKM,
          deskripsi: k.deskripsi || '',
          lokasi: k.lokasi || 'Lokasi belum ditentukan'
        },
        url: `/user/kegiatan/${k.id}`,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        textColor: '#ffffff'
      };
      
      console.log('Created event:', event);
      return event;
    });
    
    console.log('Returning events:', events.length);
    res.json(events);
    
  } catch (error) {
    console.error('=== ERROR in calendar data ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Gagal mengambil data kegiatan',
      detail: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;