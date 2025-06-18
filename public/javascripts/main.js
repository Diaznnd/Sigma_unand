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