document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const modal = $("#reyhan-modal");
  const modalTitle = $("#reyhan-modal-title");
  const modalContent = $("#reyhan-modal-content");
  const form = $("#consultation-form");
  const modalActions = $("#reyhan-modal-actions");
  const header = $("header");
  let lastFocus = null;
  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function openModal(title, html = "", showForm = false) {
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalContent.innerHTML = html;
    form.hidden = !showForm;
    form.reset();
    const submitButton = $('button[type="submit"]', form);
    if (submitButton)
      submitButton.innerHTML = 'ارسال فرم <span aria-hidden="true">←</span>';
    modalActions.innerHTML = "";
    const success = $(".form-note", form);
    if (success)
      success.textContent =
        "فرم در این پیش‌نمایش اعتبارسنجی می‌شود؛ برای ارسال واقعی، اتصال به بک‌اند یا سرویس فرم لازم است.";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const first = showForm ? $("input", form) : $("[data-modal-close]", modal);
    setTimeout(() => first && first.focus(), 20);
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-modal-close]").forEach((el) =>
    el.addEventListener("click", closeModal),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  $$("[data-scroll-target]").forEach((btn) =>
    btn.addEventListener("click", () => {
      scrollToId(btn.dataset.scrollTarget);
      const mobile = $(".mobile-nav");
      if (mobile) mobile.classList.remove("mobile-nav-open");
      const menuBtn = $('[aria-label="باز کردن منو"]');
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }),
  );
  $$("[data-open-consultation]").forEach((btn) =>
    btn.addEventListener("click", () =>
      openModal(
        "درخواست مشاوره رایگان",
        "اطلاعات زیر را وارد کنید تا برای هماهنگی مشاوره و تعیین سطح از شما درخواست شود.",
        true,
      ),
    ),
  );

  const menuBtn = $('[aria-label="باز کردن منو"]');
  let mobileNav = null;
  if (menuBtn) {
    const headerDivs = $$("div", header);
    mobileNav = headerDivs.find((div) =>
      div.querySelector('nav[aria-label="ناوبری موبایل"]'),
    );
    if (mobileNav) mobileNav.classList.add("mobile-nav");
    menuBtn.addEventListener("click", () => {
      const open = mobileNav && mobileNav.classList.toggle("mobile-nav-open");
      menuBtn.setAttribute("aria-expanded", String(!!open));
    });
  }
  window.addEventListener(
    "scroll",
    () =>
      header &&
      header.classList.toggle("reyhan-header-scrolled", window.scrollY > 18),
    { passive: true },
  );



  function addConsultButton() {
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "rounded-lg bg-saffron px-5 py-3 text-[13px] font-bold text-white transition-all hover:bg-[#c26a05]";
    b.textContent = "درخواست مشاوره";
    b.addEventListener("click", () =>
      openModal(
        "درخواست مشاوره رایگان",
        "اطلاعات زیر را وارد کنید تا برای هماهنگی مشاوره با شما تماس گرفته شود.",
        true,
      ),
    );
    modalActions.append(b);
  }
  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  $$('[data-teacher-profile="true"]').forEach((btn) =>
    btn.addEventListener("click", () => {
      const d = btn.dataset;
      const facts = [
        d.language ? `<p><b>زبان:</b> ${escapeHtml(d.language)}</p>` : "",
        d.course ? `<p><b>زمینه تدریس:</b> ${escapeHtml(d.course)}</p>` : "",
        d.level
          ? `<p><b>سطح‌های آموزشی:</b> <span dir="ltr">${escapeHtml(d.level)}</span></p>`
          : "",
        d.experience
          ? `<p><b>سابقه تدریس:</b> ${escapeHtml(d.experience)} سال</p>`
          : "",
      ]
        .filter(Boolean)
        .join("");
      openModal(
        "پروفایل " + (d.name || "استاد"),
        `<div class="profile-details">${facts}<p class="mt-3">برای اطلاع از زمان کلاس‌ها و انتخاب سطح مناسب، درخواست مشاوره ثبت کنید.</p></div>`,
        false,
      );
      addConsultButton();
    }),
  );

  let selectedLanguage = "همه";
  let selectedLevel = "همه";
  const filterButtons = $$("[data-filter-type]");
  const teacherArticles = $$("#teachers article");
  const teacherCount = $("#teacher-count") || teachCountElement();

  function syncFilters() {
    filterButtons.forEach((b) => {
      const active =
        b.dataset.filterType === "language"
          ? b.dataset.filterValue === selectedLanguage
          : b.dataset.filterValue === selectedLevel;
      b.setAttribute("aria-pressed", String(active));
      b.classList.toggle("border-saffron", active);
      b.classList.toggle("bg-saffron", active);
      b.classList.toggle("text-white", active);
      b.classList.toggle(
        "shadow-[0_10px_20px_-14px_rgba(217,119,6,0.95)]",
        active,
      );
      b.classList.toggle("border-border", !active);
      b.classList.toggle("bg-white", !active);
      b.classList.toggle("text-ink-soft", !active);
    });

    let visible = 0;
    teacherArticles.forEach((article) => {
      const profile = $('[data-teacher-profile="true"]', article);
      const language = profile?.dataset.language || "";
      const levelRange = profile?.dataset.level || "";
      let levelMatches = selectedLevel === "همه";
      if (selectedLevel === "مبتدی") levelMatches = /A[1-2]/i.test(levelRange);
      if (selectedLevel === "متوسط") levelMatches = /B[1-2]/i.test(levelRange);
      if (selectedLevel === "پیشرفته")
        levelMatches = /C[1-2]/i.test(levelRange);

      const show =
        (selectedLanguage === "همه" || language === selectedLanguage) &&
        levelMatches;
      const cardWrapper = article.parentElement || article;
      cardWrapper.hidden = !show;
      cardWrapper.style.display = show ? "" : "none";
      article.hidden = !show;
      article.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (teacherCount) teacherCount.textContent = `${visible} استاد یافت شد`;
  }

  function teachCountElement() {
    return $$("#teachers *").find(
      (el) =>
        el.children.length === 0 &&
        /[\d۰-۹]+ استاد یافت شد/.test(el.textContent.trim()),
    );
  }

  $$("#languages [data-course-detail][data-course]").forEach((card) => {
    card.addEventListener("click", () => {
      selectedLanguage = card.dataset.course || "همه";
      selectedLevel = "همه";
      syncFilters();
      scrollToId("teachers");
    });
  });

  $$("[data-language-jump]").forEach((link) => {
    link.addEventListener("click", () => {
      selectedLanguage = link.dataset.languageJump || "همه";
      selectedLevel = "همه";
      syncFilters();
      scrollToId("teachers");
    });
  });

  filterButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.dataset.filterType === "language") {
        selectedLanguage = btn.dataset.filterValue;
      } else {
        selectedLevel =
          selectedLevel === btn.dataset.filterValue
            ? "همه"
            : btn.dataset.filterValue;
      }
      syncFilters();
    }),
  );
  syncFilters();

  const reviewGrid = $("#review-grid");
  let reviewIndex = 0;
  const reviewItems = reviewGrid ? $$(":scope > div", reviewGrid) : [];
  const reviewButtons = $$("[data-review-direction]");
  function rotateReviews(direction) {
    if (!reviewGrid || reviewItems.length < 2) return;
    reviewIndex =
      (reviewIndex + (direction === "next" ? 1 : reviewItems.length - 1)) %
      reviewItems.length;
    const ordered = reviewItems
      .slice(reviewIndex)
      .concat(reviewItems.slice(0, reviewIndex));
    ordered.forEach((item) => reviewGrid.appendChild(item));
    if (window.matchMedia("(max-width: 767px)").matches) {
      Array.from(reviewGrid.children).forEach((item, i) => {
        item.hidden = i !== 0;
      });
    } else {
      reviewItems.forEach((item) => {
        item.hidden = false;
      });
    }
  }
  reviewButtons.forEach((btn) =>
    btn.addEventListener("click", () =>
      rotateReviews(btn.dataset.reviewDirection),
    ),
  );
  function updateReviewLayout() {
    if (!reviewGrid) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      Array.from(reviewGrid.children).forEach((item, i) => {
        item.hidden = i !== 0;
      });
    } else
      reviewItems.forEach((item) => {
        item.hidden = false;
      });
  }
  updateReviewLayout();
  window.addEventListener("resize", updateReviewLayout);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const note = $(".form-note", form);
    if (note) {
      note.textContent =
        "درخواست شما ارسال شد";
      note.classList.add("form-note-success");
    }
    form.querySelector('button[type="submit"]').textContent = "فرم بررسی شد";
  });
});
