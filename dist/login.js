// Barreira de apresentação no navegador, conforme solicitado.
// O conteúdo e a senha continuam acessíveis nos arquivos públicos do site.
const sessionKey = 'multiplix-marcio-raposo';
const form = document.getElementById('login-form');
const password = document.getElementById('password');
const error = document.getElementById('login-error');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (password.value !== 'marcioraposo123') {
    error.textContent = 'Senha incorreta. Confira a senha e tente novamente.';
    password.setAttribute('aria-invalid', 'true');
    password.focus();
    return;
  }
  try {
    sessionStorage.setItem(sessionKey, 'authorized');
    window.location.assign('/raiox.html');
  } catch {
    error.textContent = 'Permita o armazenamento desta página no navegador para continuar.';
  }
});
password.addEventListener('input', () => {
  error.textContent = '';
  password.removeAttribute('aria-invalid');
});
