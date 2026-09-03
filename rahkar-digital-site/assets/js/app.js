(() => {
  'use strict';

  const state = { activeSection: 'home' };
  const sections = [...document.querySelectorAll('.page-section')];
  const navLinks = [...document.querySelectorAll('[data-target]')];
  const mobileNav = document.getElementById('mobileNav');
  const menuBtn = document.getElementById('menuBtn');
  const mobileClose = document.getElementById('mobileClose');
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchForm = document.getElementById('searchForm');
  const toast = document.getElementById('toast');
  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  function setActiveSection(target, updateUrl = true) {
    const section = document.getElementById(target);
    if (!section) return;
    state.activeSection = target;
    sections.forEach(s => s.classList.toggle('active', s.id === target));
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.target === target));
    document.title = `${section.dataset.title} | راهکار دیجیتال`;
    if (updateUrl) history.pushState({ section: target }, '', `#${target}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const target = link.dataset.target;
      if (target) { event.preventDefault(); setActiveSection(target); }
    });
  });

  menuBtn?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMobileMenu(); });

  searchToggle?.addEventListener('click', () => {
    const isHidden = searchPanel.hasAttribute('hidden');
    if (isHidden) { searchPanel.removeAttribute('hidden'); setTimeout(() => document.getElementById('siteSearch')?.focus(), 50); }
    else searchPanel.setAttribute('hidden', '');
  });

  searchForm?.addEventListener('submit', e => {
    e.preventDefault();
    const query = document.getElementById('siteSearch').value.trim();
    if (!query) return showToast('لطفاً عبارت موردنظر را وارد کنید.');
    const map = [{ words:['طراحی','سایت','وب'], target:'services' }, { words:['نمونه','کار'], target:'portfolio' }, { words:['چرا','سود','فایده'], target:'why' }, { words:['تماس','ارتباط'], target:'contact' }];
    const found = map.find(item => item.words.some(word => query.includes(word)));
    if (found) { setActiveSection(found.target); searchPanel.setAttribute('hidden',''); }
    else showToast('نتیجه مستقیمی پیدا نشد؛ از منوی بالا استفاده کنید.');
  });

  document.querySelectorAll('.detail-btn').forEach(btn => btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.project || 'پروژه نمونه';
    projectModal.classList.add('open'); projectModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }));
  function closeModal(){ projectModal.classList.remove('open'); projectModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  modalClose?.addEventListener('click', closeModal);
  projectModal?.addEventListener('click', e => { if (e.target === projectModal) closeModal(); });

  function showToast(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast._t); showToast._t=setTimeout(()=>toast.classList.remove('show'),2600); }

  document.getElementById('year').textContent = new Date().getFullYear();
  const initial = location.hash.replace('#','');
  if (initial && document.getElementById(initial)) setActiveSection(initial, false);
  window.addEventListener('popstate', () => setActiveSection(location.hash.replace('#','') || 'home', false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeMobileMenu(); closeModal(); }
  });
})();
