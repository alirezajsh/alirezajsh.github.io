document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $('header button[aria-controls="mobile-nav"]');
  const mobileNav = $('#mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
    });
    $$('a[href^="#"]', mobileNav).forEach(link => link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'باز کردن منو');
    }));
  }

  // Menu category filters
  const cards = $$('#menu article[data-menu-item]');
  const filterButtons = $$('#menu [data-filter]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      item.classList.remove('bg-[#1E5631]', 'text-white', 'shadow-[0_4px_14px_rgba(30,86,49,0.25)]');
      item.classList.add('text-[#5A5A5A]');
    });
    button.classList.add('bg-[#1E5631]', 'text-white');
    button.classList.remove('text-[#5A5A5A]');
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  }));

  // Read more in the About section
  const readMore = $('#about .read-more-btn');
  if (readMore) {
    readMore.addEventListener('click', () => {
      const extra = $('.about-extra-text', $('#about'));
      const expanded = readMore.getAttribute('aria-expanded') === 'true';
      extra.hidden = expanded;
      readMore.setAttribute('aria-expanded', String(!expanded));
      readMore.textContent = expanded ? 'ادامه مطلب' : 'نمایش کمتر';
    });
  }

  // Shared details / gallery modal
  const modal = $('#site-modal');
  const modalImage = $('#modal-image');
  const modalTitle = $('#modal-title');
  const modalDescription = $('#modal-description');
  const modalPrice = $('#modal-price');
  const reserveLink = $('#modal-reserve-link');
  let lastFocused = null;
  const openModal = ({ title = '', description = '', price = '', image = '', alt = '', reserve = true }) => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalPrice.textContent = price;
    modalPrice.hidden = !price;
    reserveLink.hidden = !reserve;
    if (image) {
      modalImage.src = image;
      modalImage.alt = alt || title;
      modalImage.hidden = false;
    } else {
      modalImage.removeAttribute('src');
      modalImage.hidden = true;
    }
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.site-modal__close', modal)?.focus();
  };
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocused?.focus?.();
  };
  $$('[data-modal-close]', modal).forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
  cards.forEach(card => {
    const button = $('[data-action="details"]', card);
    button?.addEventListener('click', () => {
      const title = $('h3', card)?.textContent.trim() || 'جزئیات غذا';
      const price = card.querySelector('div.flex.items-start.justify-between span')?.textContent.trim() || '';
      const description = $('p', card)?.textContent.trim() || '';
      const image = $('img', card)?.getAttribute('src') || '';
      openModal({ title, description, price, image, alt: title, reserve: true });
    });
  });
  $$('#gallery [data-gallery-item]').forEach(button => button.addEventListener('click', () => {
    const img = $('img', button);
    if (!img) return;
    openModal({ title: img.alt || 'نگارخانه باغ ایرانی', image: img.src, alt: img.alt, reserve: false });
  }));
  reserveLink?.addEventListener('click', closeModal);

  // Review carousel — sample copy is explicitly identified in the page.
  const reviews = [
    { quote: 'فضای گرم و آرام، در کنار عطر غذای ایرانی، تجربه‌ای دلنشین برای یک دورهمی خانوادگی می‌سازد.', author: 'مهمان باغ ایرانی' },
    { quote: 'ترکیب طعم‌های آشنا، سرو مرتب و حال‌وهوای سنتی، اینجا را برای یک قرار دوستانه مناسب می‌کند.', author: 'مهمان باغ ایرانی' },
    { quote: 'برای یک شب متفاوت، محیط صمیمی و منوی ایرانی باغ می‌تواند انتخاب دلپذیری باشد.', author: 'مهمان باغ ایرانی' }
  ];
  let reviewIndex = 0;
  const renderReview = () => {
    const quote = $('[data-review-quote]');
    const author = $('[data-review-author]');
    if (quote && author) {
      quote.textContent = reviews[reviewIndex].quote;
      author.textContent = reviews[reviewIndex].author;
    }
    $$('[data-review-dot]').forEach((dot, index) => dot.setAttribute('aria-current', String(index === reviewIndex)));
  };
  $('[data-review-prev]')?.addEventListener('click', () => { reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length; renderReview(); });
  $('[data-review-next]')?.addEventListener('click', () => { reviewIndex = (reviewIndex + 1) % reviews.length; renderReview(); });
  $$('[data-review-dot]').forEach(dot => dot.addEventListener('click', () => { reviewIndex = Number(dot.dataset.reviewDot); renderReview(); }));

  // Reservation form: validate and hand the booking details to the restaurant by email.
  const form = $('#reservation form');
  if (form) {
    const dateField = $('#res-date');
    if (dateField) {
      const now = new Date();
      const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.min = today;
    }
    const timeButtons = $$('fieldset button[type="button"]', form);
    const selectedTime = $('#res-time');
    timeButtons.forEach(button => button.addEventListener('click', () => {
      timeButtons.forEach(item => {
        item.setAttribute('aria-pressed', 'false');
        item.classList.remove('bg-[#1E5631]', 'text-white', 'border-[#1E5631]');
        item.classList.add('bg-white', 'text-[#5A5A5A]');
      });
      button.setAttribute('aria-pressed', 'true');
      button.classList.add('bg-[#1E5631]', 'text-white', 'border-[#1E5631]');
      button.classList.remove('bg-white', 'text-[#5A5A5A]');
      if (selectedTime) selectedTime.value = button.textContent.trim();
      $('#reservation-status').hidden = true;
    }));
    const status = $('#reservation-status');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!selectedTime?.value) {
        if (status) {
          status.hidden = false;
          status.textContent = 'لطفاً ساعت موردنظر را انتخاب کنید.';
          status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      const name = $('#res-name').value.trim();
      const phone = $('#res-phone').value.trim();
      const guests = $('#res-guests').value;
      const date = $('#res-date').value;
      const notes = $('#res-notes').value.trim();
      const digits = phone.replace(/[۰-۹٠-٩]/g, ch => '۰۱۲۳۴۵۶۷۸۹'.indexOf(ch) >= 0 ? String('۰۱۲۳۴۵۶۷۸۹'.indexOf(ch)) : String('٠١٢٣٤٥٦٧٨٩'.indexOf(ch)));
      if (digits.replace(/\D/g, '').length < 8) {
        $('#res-phone').setCustomValidity('شماره تماس معتبر وارد کنید.');
        $('#res-phone').reportValidity();
        $('#res-phone').setCustomValidity('');
        return;
      }
      const body = [
        'درخواست رزرو میز - رستوران باغ ایرانی',
        `نام: ${name}`,
        `شماره تماس: ${phone}`,
        `تعداد نفرات: ${guests}`,
        `تاریخ: ${date}`,
        `ساعت: ${selectedTime.value}`,
        `توضیحات: ${notes || '—'}`
      ].join('\n');
      const mailto = `mailto:salam@baghirani.ir?subject=${encodeURIComponent('درخواست رزرو میز')}&body=${encodeURIComponent(body)}`;
      if (status) {
        status.hidden = false;
        status.innerHTML = 'اطلاعات فرم آماده شد. برای ارسال درخواست، برنامهٔ ایمیل شما باز می‌شود؛ پس از باز شدن ایمیل، دکمهٔ ارسال را بزنید. تا پیش از تأیید رستوران، رزرو قطعی نیست. ';
        const link = document.createElement('a');
        link.href = mailto;
        link.textContent = 'باز کردن دوبارهٔ ایمیل';
        link.style.marginInlineStart = '6px';
        status.append(link);
      }
      window.location.href = mailto;
    });
  }
});
