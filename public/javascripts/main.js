  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

    console.log("main.js loaded");

    toggleBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      toggleIcon.classList.toggle("fa-eye");
      toggleIcon.classList.toggle("fa-eye-slash");
    });
  });

  let selectedForm = null;

    function openRoleModal(text, formId) {
      document.getElementById('modalText').textContent = text;
      document.getElementById('roleModal').classList.remove('hidden');
      selectedForm = document.getElementById(formId);
    }

    function closeRoleModal() {
      document.getElementById('roleModal').classList.add('hidden');
      selectedForm = null;
    }

    function submitRoleForm() {
      if (selectedForm) selectedForm.submit();
    }

      function showModal(id) {
      document.getElementById('modal-' + id).classList.remove('hidden');
    }
    function closeModal(id) {
      document.getElementById('modal-' + id).classList.add('hidden');
    }

    function openModal(src) {
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modal-image');
      modalImg.src = src;
      modal.classList.remove('hidden');
    }

    function closeModal() {
      const modal = document.getElementById('modal');
      const modalImg = document.getElementById('modal-image');
      modalImg.src = '';
      modal.classList.add('hidden');
    }


    function showModal(id) {
      document.getElementById('modal-' + id).classList.remove('hidden');
    }
    function closeModal(id) {
      document.getElementById('modal-' + id).classList.add('hidden');
    }
