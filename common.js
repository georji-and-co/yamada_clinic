/* ===========================
   やまだクリニック | common.js
   =========================== */

/* ── ハンバーガーメニュー ── */
const hamburger = document.getElementById('hamburger');
const spMenu    = document.getElementById('spMenu');
if (hamburger && spMenu) {
  hamburger.addEventListener('click', () => spMenu.classList.toggle('open'));
  spMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => spMenu.classList.remove('open'));
  });
}

/* ── 診療ステータス & 昼の休憩時間バー ── */
function getClinicStatus() {
  const now  = new Date();
  const day  = now.getDay();   // 0=日,1=月…6=土
  const t    = now.getHours() * 60 + now.getMinutes();

  const AM_S = 9  * 60;  // 9:00
  const AM_E = 12 * 60;  // 12:00
  const LN_E = 15 * 60;  // 15:00（昼休憩終わり）
  const PM_E = 18 * 60;  // 18:00

  if (day === 0) return { open: false, lunch: false, label: '本日休診（日曜）' };

  if (day === 3 || day === 6) { // 水・土：午前のみ
    if (t >= AM_S && t < AM_E) return { open: true,  lunch: false, label: '診療中（午前）' };
    return { open: false, lunch: false, label: '受付終了 / 午後休診' };
  }

  // 月火木金
  if (t >= AM_S && t < AM_E) return { open: true,  lunch: false, label: '診療中（午前）' };
  if (t >= AM_E && t < LN_E) return { open: false, lunch: true,  label: '昼の休憩時間中' };
  if (t >= LN_E && t < PM_E) return { open: true,  lunch: false, label: '診療中（午後）' };
  return { open: false, lunch: false, label: '受付終了' };
}

const status = getClinicStatus();

/* ステータスチップ */
document.querySelectorAll('.status-chip').forEach(el => {
  el.classList.add(status.open ? 'open' : 'closed');
  el.textContent = status.label;
});

/* 昼の休憩時間バー：全ページに動的挿入 */
if (status.lunch) {
  // バー要素を生成
  const bar = document.createElement('div');
  bar.className = 'lunch-bar';
  bar.innerHTML = `
    <div class="lunch-bar-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <p class="lunch-bar-text">
      <strong>休診中</strong> です &nbsp;／&nbsp; 午後の診療は <strong>15:00〜</strong> 再開します
    </p>
    <span class="lunch-bar-badge">12:00〜15:00</span>
  `;
  document.body.prepend(bar);
  // CSS offset が重なるので --offset を 40px 押し下げる
  document.documentElement.style.setProperty(
    '--offset',
    `calc(var(--demo-h) + var(--header-h) + 40px)`
  );
  // 少し遅らせて open クラスを付与（アニメーション）
  requestAnimationFrame(() => bar.classList.add('open'));
}

/* ── フェードイン（IntersectionObserver）── */
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── アクティブボトムナビ ── */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.sp-bottom-nav a').forEach(a => {
  if ((a.getAttribute('href') || '').split('/').pop() === currentPage) a.classList.add('active');
});
