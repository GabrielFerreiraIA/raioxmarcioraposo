const chapterLinks = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of chapterLinks) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  for (const link of chapterLinks) {
    const section = document.getElementById(link.hash.slice(1));
    if (section) observer.observe(section);
  }
}
// Printing expands native details; restore the reader's selections afterwards.
let printState = [];
window.addEventListener('beforeprint', () => {
  printState = [...document.querySelectorAll('details')].map(detail => [detail, detail.open]);
  for (const [detail] of printState) detail.open = true;
});
window.addEventListener('afterprint', () => {
  for (const [detail, open] of printState) detail.open = open;
});
