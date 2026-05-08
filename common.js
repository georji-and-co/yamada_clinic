/* ===========================
   やまだクリニック | common.js
   =========================== */

/* ── ハンバーガーメニュー ── */
const hamburger = document.getElementById('hamburger');
const spMenu    = document.getElementById('spMenu');
if (hamburger && spMenu) {
  hamburger.addEventListener('click', () => {
    spMenu.classList.toggle('open');
  });
  spMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => spMenu.classList.remove('open'));
  });
}

/* ── 診療時間ステータスチップ ── */
function getClinicStatus() {
  const now = new Date();
  const day  = now.getDay();   // 0=日,1=月...6=土
  const hour = now.getHours();
  const min  = now.getMinutes();
  const t    = hour * 60 + min;

  const AM_S = 9  * 60;       // 9:00
  const AM_E = 12 * 60;       // 12:00
  const PM_S = 15 * 60;       // 15:00
  const PM_E = 18 * 60;       // 18:00

  // 日(0)祝 → 休診
  if (day === 0) return { open: false, label: '本日休診' };

  // 水(3) → 午前のみ
  if (day === 3) {
    if (t >= AM_S && t < AM_E) return { open: true,  label: '診療中（午前）' };
    return { open: false, label: '受付終了 / 午後休診' };
  }

  // 土(6) → 午前のみ
  if (day === 6) {
    if (t >= AM_S && t < AM_E) return { open: true,  label: '診療中（土曜午前）' };
    return { open: false, label: '受付終了 / 午後休診' };
  }

  // 月火木金 → 午前 + 午後
  if (t >= AM_S && t < AM_E) return { open: true,  label: '診療中（午前）' };
  if (t >= 12 * 60 && t < PM_S) return { open: false, label: '昼休み' };
  if (t >= PM_S && t < PM_E)  return { open: true,  label: '診療中（午後）' };
  return { open: false, label: '受付終了' };
}

document.querySelectorAll('.status-chip').forEach(el => {
  const { open, label } = getClinicStatus();
  el.classList.add(open ? 'open' : 'closed');
  el.textContent = label;
});

/* ── フェードイン（IntersectionObserver）── */
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── アクティブボトムナビ ── */
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.sp-bottom-nav a').forEach(a => {
  const href = a.getAttribute('href').split('/').pop();
  if (href === currentPath) a.classList.add('active');
});
