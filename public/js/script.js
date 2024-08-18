function toggleForm(formId) {
  const form = document.getElementById(formId);
  if (form.classList.contains('active')) {
    form.classList.remove('active');
  } else {
    // Close any open forms
    document.querySelectorAll('.collapsible-form.active').forEach(activeForm => {
      activeForm.classList.remove('active');
    });
    // Open the selected form
    form.classList.add('active');
  }
}
