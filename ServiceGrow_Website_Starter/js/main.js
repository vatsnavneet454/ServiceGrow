const menu = document.getElementById('menu');
const links = document.getElementById('links');
menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  document.getElementById('formMessage').textContent =
    'Thanks! The form interface works. Connect a backend endpoint to receive and store enquiries.';
  document.getElementById('formMessage').style.color = '#2f7658';
  form.reset();
});
