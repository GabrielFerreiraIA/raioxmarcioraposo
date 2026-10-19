// Controle visual de acesso; não equivale à autenticação no servidor.
function checkPresentationAccess() {
  let allowed = false;
  try { allowed = sessionStorage.getItem('multiplix-marcio-raposo') === 'authorized'; } catch {}
  if (!allowed) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace('/');
  } else {
    document.documentElement.style.visibility = '';
  }
}
checkPresentationAccess();
window.addEventListener('pageshow', checkPresentationAccess);
