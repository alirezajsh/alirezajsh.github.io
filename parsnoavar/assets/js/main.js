(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const modal = $('#site-modal');
  const modalTitle = $('#modal-title');
  const modalContent = $('#modal-content');
  let lastFocused = null;

  function openModal(title, paragraphs, bullets=[]) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = title;
    modalContent.replaceChildren();
    (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).forEach(text => {
      const p = document.createElement('p'); p.textContent = text; modalContent.append(p);
    });
    if (bullets.length) {
      const ul = document.createElement('ul');
      bullets.forEach(text => { const li=document.createElement('li'); li.textContent=text; ul.append(li); });
      modalContent.append(ul);
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    $('.modal-close', modal)?.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true');
    document.body.style.overflow=''; lastFocused?.focus?.();
  }
  $$('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key==='Escape' && modal?.classList.contains('is-open')) closeModal(); });
  $('[data-modal-contact]')?.addEventListener('click', closeModal);

  // Mobile navigation.
  const menuButton = $('header button[aria-label="باز کردن منو"]');
  const mobileNav = $('#mobile-navigation');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'باز کردن منو' : 'بستن منو');
      mobileNav.hidden = expanded;
    });
    $$('a', mobileNav).forEach(link => link.addEventListener('click', () => {
      mobileNav.hidden=true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','باز کردن منو');
    }));
    document.addEventListener('click', e => {
      if (!mobileNav.hidden && !mobileNav.contains(e.target) && !menuButton.contains(e.target)) {
        mobileNav.hidden=true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','باز کردن منو');
      }
    });
  }

  // Consultation CTAs always lead to the contact form.
  $$('a[href="#contact"]').forEach(a => a.addEventListener('click', () => {
    if (a.hasAttribute('data-modal-contact')) closeModal();
  }));

  // Services: complete each «جزئیات بیشتر» action with a detail dialog.
  const serviceDetails = [
    ['توسعه نرم‌افزار سازمانی', 'راهکارهای نرم‌افزاری اختصاصی را بر اساس گردش‌کار، ساختار داده و اهداف عملیاتی سازمان طراحی می‌کنیم. مسیر کار از تحلیل فرایندها و تدوین نیازمندی‌ها آغاز می‌شود و با معماری فنی، توسعه مرحله‌ای و آزمون‌های کنترل کیفیت ادامه پیدا می‌کند.', ['معماری ماژولار و توسعه‌پذیر','اتصال امن به سامانه‌ها و پایگاه‌های داده موجود','داشبوردها و پنل‌های مدیریتی متناسب با نقش کاربران','مستندسازی، آموزش و پشتیبانی پس از تحویل']],
    ['اپلیکیشن موبایل', 'اپلیکیشن‌های همراه برای ساده‌کردن دسترسی مشتریان و کارکنان به خدمات سازمان ساخته می‌شوند. از طراحی تجربه کاربری تا پیاده‌سازی، اتصال امن به سرویس‌های سازمانی و آماده‌سازی انتشار، یکپارچگی تجربه در اولویت قرار دارد.', ['طراحی اختصاصی برای Android و iOS','طراحی مسیرهای کاربری و رابط واکنش‌گرا','اتصال امن به API و سامانه‌های سازمانی','آماده‌سازی انتشار، تحلیل خطا و به‌روزرسانی']],
    ['زیرساخت ابری و DevOps', 'محیط اجرای نرم‌افزار باید متناسب با بار کاری، سطح دسترس‌پذیری و الزامات امنیتی سازمان طراحی شود. با خودکارسازی فرایند انتشار و تعریف پایش مداوم، تحویل نسخه‌های جدید کنترل‌پذیرتر و بازیابی سرویس‌ها قابل اتکاتر می‌شود.', ['طراحی محیط‌های توسعه، آزمون و عملیاتی','خط لوله CI/CD و استقرار کنترل‌شده','پایش منابع، ثبت رخداد و هشداردهی','پشتیبان‌گیری و برنامه بازیابی بحران']],
    ['هوش مصنوعی و تحلیل داده', 'با شناخت منابع داده و پرسش‌های تصمیم‌گیری مدیران، داده‌ها را آماده‌سازی و به شاخص‌های قابل فهم تبدیل می‌کنیم. بسته به مسئله، داشبوردهای تحلیلی یا مدل‌های پیش‌بینی طراحی می‌شوند و خروجی آن‌ها در اختیار فرایندهای واقعی سازمان قرار می‌گیرد.', ['یکپارچه‌سازی، پاک‌سازی و آماده‌سازی داده‌ها','داشبوردهای مدیریتی و شاخص‌های کلیدی عملکرد','مدل‌های پیش‌بینی و تحلیل متناسب با مسئله','ارزیابی کیفیت و پایش عملکرد مدل‌ها']],
    ['طراحی محصول و تجربه کاربری', 'پیش از صرف هزینه برای توسعه، مسئله واقعی کاربران و مسیر رسیدن آن‌ها به هدف بررسی می‌شود. خروجی این مرحله، نقشه روشن‌تری از امکانات ضروری و نمونه‌ای قابل ارزیابی است تا ریسک تصمیم‌های طراحی کاهش یابد.', ['مصاحبه، مشاهده و پژوهش کاربر','طراحی جریان تعامل، وایرفریم و نمونه اولیه','ساخت سیستم طراحی یکپارچه','آزمون کاربردپذیری و بهبود بر اساس بازخورد']],
    ['امنیت اطلاعات و پشتیبانی', 'امنیت به یک مرحله پایانی محدود نیست؛ باید در معماری، توسعه، استقرار و نگهداشت دیده شود. با بررسی ریسک‌ها، اصلاح تنظیمات حساس و تعریف فرایند پاسخ‌گویی، احتمال اختلال و دسترسی غیرمجاز کاهش می‌یابد.', ['ارزیابی ریسک و آسیب‌پذیری','سخت‌سازی زیرساخت و مدیریت دسترسی','به‌روزرسانی و رسیدگی به رخدادهای امنیتی','پشتیبانی فنی و توافقنامه سطح خدمت (SLA)']]
  ];
  $$('#services button[aria-label^="جزئیات بیشتر"]').forEach((button, index) => {
    button.addEventListener('click', () => {
      const item = serviceDetails[index]; if (item) openModal(item[0], item[1], item[2]);
    });
  });

  // Portfolio filters and project details.
  const portfolio = $('#portfolio');
  if (portfolio) {
    const filterButtons = $$('button[data-collection-item-field="category"]', portfolio);
    const projectGrid = portfolio.querySelector('div.mt-8.grid');
    const cards = projectGrid ? [...projectGrid.children] : [];
    filterButtons.forEach(button => button.addEventListener('click', () => {
      const selected = button.textContent.trim();
      filterButtons.forEach(b => {
        const active = b === button; b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('bg-[#0F4C81]',active); b.classList.toggle('text-white',active);
        b.classList.toggle('border-[#0F4C81]',active); b.classList.toggle('bg-white',!active);
      });
      cards.forEach(card => { card.hidden = selected !== 'همه' && card.dataset.projectCategory !== selected; });
    }));
    const projects = [
      ['سامانه بانکداری دیجیتال «همراه»','فینتک | بانک آرمان | ۱۴۰۲','بازطراحی کانال موبایل بانک برای ارائه تجربه‌ای یکپارچه و امن به کاربران. طبق توضیح پروژه، سامانه برای ۲٫۴ میلیون کاربر طراحی شده و از معماری میکروسرویس و احراز هویت یکپارچه بهره می‌برد.',['تجربه موبایل بانک یکپارچه','معماری میکروسرویس','احراز هویت یکپارچه']],
      ['پلتفرم لجستیک هوشمند «راهبر»','لجستیک | شرکت حمل‌ونقل آرین | ۱۴۰۳','راهکار مدیریت ناوگان برای بهینه‌سازی مسیرها، مشاهده وضعیت ناوگان و تخصیص خودکار بار؛ با تمرکز بر شفافیت عملیات و کاهش هزینه‌های قابل کنترل.',['مسیریابی پویا','ردیابی لحظه‌ای ناوگان','پشتیبانی از بیش از ۹۰۰ کامیون']],
      ['اپلیکیشن سلامت «تندرست»','سلامت | کلینیک مهر | ۱۴۰۳','سامانه یکپارچه خدمات درمانی برای ساده‌سازی ارتباط مراجعه‌کننده با کلینیک و پیگیری مراحل درمان.',['نوبت‌دهی آنلاین','پرونده الکترونیک','پیگیری درمان برای شبکه ۱۲ کلینیک']],
      ['داشبورد تحلیل داده‌های صنعتی','تحلیل داده | گروه صنعتی البرز | ۱۴۰۲','داشبورد یکپارچه برای مشاهده وضعیت خطوط تولید و شناسایی زودهنگام نشانه‌های خرابی تجهیزات.',['یکپارچه‌سازی داده ۷ خط تولید','پیش‌بینی خرابی تجهیزات','استفاده از مدل‌های یادگیری ماشین']],
      ['فروشگاه آنلاین «بازارک»','خرده‌فروشی | هلدینگ بازرگانی کاسپین | ۱۴۰۳','راهکار تجارت الکترونیک چندفروشندگی برای مدیریت تجربه خرید، موجودی و پرداخت در یک بستر یکپارچه.',['مدیریت همزمان موجودی ۴ انبار','پشتیبانی از چند فروشنده','پرداخت آنلاین']],
      ['سامانه منابع انسانی «همکار»','سازمانی | شرکت پتروپالایش | ۱۴۰۱','سامانه مدیریت چرخه امور کارکنان برای یکپارچه‌سازی داده‌ها و فرایندهای منابع انسانی.',['مدیریت حضور و غیاب','ارزیابی عملکرد','حقوق و دستمزد برای ۳٬۲۰۰ نفر']]
    ];
    cards.forEach((card,index) => card.addEventListener('click', () => {
      const p=projects[index]; if (p) openModal(p[0], [p[1],p[2]], p[3]);
    }));
  }

  // Blog «ادامه مطلب» opens the expanded article rather than doing nothing.
  const articles = [
    ['معماری میکروسرویس یا یکپارچه؟ راهنمای انتخاب برای سازمان‌های ایرانی',[
      'انتخاب معماری نرم‌افزار تصمیمی کوتاه‌مدت نیست؛ روی هزینه نگهداشت، سرعت تغییر و پیچیدگی عملیات در سال‌های بعد اثر می‌گذارد. معماری یکپارچه برای بسیاری از محصولات با دامنه محدود، تیم کوچک و نیازهای نسبتاً پایدار انتخابی منطقی است.',
      'میکروسرویس زمانی ارزش پیدا می‌کند که مرزهای دامنه روشن باشند، بخش‌های محصول به استقلال در توسعه و استقرار نیاز داشته باشند و سازمان آمادگی مدیریت زیرساخت توزیع‌شده، پایش و ارتباطات بین سرویس‌ها را داشته باشد.',
      'پیشنهاد عملی این است که ابتدا دامنه کسب‌وکار و نقاط تغییرپذیر را مشخص کنید. از پیچیدگی زودهنگام دوری کنید و فقط زمانی سرویس‌ها را جدا کنید که مزیت استقلال، هزینه عملیاتی بیشتر را توجیه کند.'
    ],['اندازه و بلوغ تیم','پیچیدگی دامنه و نرخ تغییر','هزینه عملیات و پایش','نیاز به مقیاس‌پذیری مستقل']],
    ['مهاجرت به ابر: پنج اشتباه رایج که هزینه‌بر می‌شود',[
      'مهاجرت موفق به ابر با انتقال ساده ماشین‌های مجازی پایان نمی‌یابد. اگر معماری، هزینه، امنیت و مسئولیت‌های عملیاتی از ابتدا بررسی نشوند، سازمان ممکن است فقط محل هزینه‌کرد خود را تغییر دهد.',
      'اشتباه‌های رایج شامل انتقال بدون بازطراحی، برآورد نکردن هزینه ترافیک و ذخیره‌سازی، تعریف نکردن سیاست پشتیبان‌گیری، نادیده گرفتن کنترل دسترسی و نبود برنامه پایش و بهینه‌سازی مداوم است.',
      'پیش از مهاجرت، سرویس‌ها را دسته‌بندی کنید، خط مبنای هزینه و کارایی بسازید، یک پروژه آزمایشی انتخاب کنید و پس از هر مرحله شاخص‌های هزینه، دسترس‌پذیری و امنیت را بسنجید.'
    ],['ارزیابی آمادگی سرویس‌ها','برآورد هزینه کل مالکیت','برنامه پشتیبان‌گیری و بازیابی','کنترل دسترسی و امنیت','پایش و بهینه‌سازی مستمر']],
    ['چگونه پیش از توسعه، ایده محصول را اعتبارسنجی کنیم؟',[
      'ساخت محصول پیش از آزمودن فرض‌های اصلی می‌تواند هزینه زیادی ایجاد کند. اعتبارسنجی کمک می‌کند پیش از سرمایه‌گذاری سنگین، مشخص شود آیا مسئله واقعی است و راهکار پیشنهادی برای کاربران ارزش دارد یا خیر.',
      'ابتدا مسئله و گروه کاربری را دقیق تعریف کنید. سپس با مصاحبه و مشاهده، رفتار واقعی کاربران را بررسی کنید؛ بعد نمونه اولیه کم‌هزینه بسازید و آن را با سناریوهای مشخص آزمایش کنید.',
      'در پایان، بر اساس شواهد تصمیم بگیرید: ادامه توسعه، اصلاح فرضیه یا توقف ایده. معیار موفقیت باید از ابتدا قابل اندازه‌گیری باشد؛ مانند نرخ تکمیل وظیفه، تمایل به استفاده یا صرفه‌جویی زمانی.'
    ],['تعریف مسئله و فرضیه','پژوهش و گفت‌وگو با کاربران','ساخت نمونه اولیه','آزمون و تصمیم‌گیری مبتنی بر داده']]
  ];
  $$('#blog button[aria-label^="خواندن مقاله"]').forEach((button,index) => button.addEventListener('click', () => {
    const a=articles[index]; if (a) openModal(a[0], a[1], a[2]);
  }));

  // Testimonials carousel. The first quote is from the supplied page; remaining cards are sample copy.
  const reviews = [
    {quote:'«پیش از این پروژه، تخصیص بار کاملاً دستی بود. تیم پارس با شناخت عمیق از عملیات لجستیک، مسیریابی را خودکار کرد و نتیجه در سه ماه اول روی هزینه سوخت دیده شد.»',name:'امیرحسین طاهری',role:'مدیر زنجیره تأمین — شرکت حمل‌ونقل آرین',demo:false},
    {quote:'«در نسخه پیشنهادی، نیازهای تیم عملیات و مدیران در یک مسیر روشن جمع شد. داشبوردها کمک می‌کنند وضعیت کارها را سریع‌تر بررسی کنیم.»',name:'مدیر عملیات سازمانی',role:'متن نمونه؛ با نظر واقعی مشتری جایگزین شود',demo:true},
    {quote:'«فرایند طراحی مرحله‌به‌مرحله بود و پیش از شروع توسعه، تصویر روشنی از امکانات و اولویت‌ها به دست آوردیم.»',name:'مدیر محصول',role:'متن نمونه؛ با نظر واقعی مشتری جایگزین شود',demo:true},
    {quote:'«مستندسازی و انتقال دانش در پایان کار برای ما اهمیت زیادی داشت. ساختار تحویل باعث شد تیم داخلی بتواند توسعه را ادامه دهد.»',name:'مدیر فناوری اطلاعات',role:'متن نمونه؛ با نظر واقعی مشتری جایگزین شود',demo:true}
  ];
  const testimonialSection=$('#testimonials');
  const figure=$('#testimonial-figure');
  if (figure) {
    const quote=$('#testimonial-quote'), name=$('#testimonial-name'), role=$('#testimonial-role');
    const avatar=$('#testimonial-avatar-image');
    const dots=$$('button[aria-label^="نمایش نظر شماره"]', testimonialSection);
    let current=0;
    const renderReview=(index)=>{
      current=(index+reviews.length)%reviews.length; figure.classList.add('is-changing');
      window.setTimeout(()=>{
        const r=reviews[current]; quote.textContent=r.quote; name.textContent=r.name; role.textContent=r.role;
        if (avatar) { avatar.style.visibility=current===0?'visible':'hidden'; }
        dots.forEach((dot,i)=>{
          const active=i===current;
          dot.setAttribute('aria-current',String(active));
          dot.setAttribute('aria-pressed',String(active));
          dot.classList.toggle('w-7',active);
          dot.classList.toggle('w-1.5',!active);
          dot.classList.toggle('bg-[#0F4C81]',active);
          dot.classList.toggle('bg-[#0F4C81]/25',!active);
          dot.classList.remove('bg-[#0F4C81]/20');
        });
        figure.classList.remove('is-changing');
      },140);
    };
    $('[aria-label="نظر قبلی"]', testimonialSection)?.addEventListener('click',()=>renderReview(current-1));
    $('[aria-label="نظر بعدی"]', testimonialSection)?.addEventListener('click',()=>renderReview(current+1));
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>renderReview(i)));
    renderReview(0);
  }

  // Contact form: validated locally and prepared as an email (the original project has no server endpoint).
  function showStatus(el, message, kind='success') {
    if (!el) return; el.textContent=message; el.classList.remove('is-error','is-success'); el.classList.add(kind==='error'?'is-error':'is-success');
  }
  function emailLink(to, subject, body) {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  const contactForm=$('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e=>{
      e.preventDefault();
      const val=id=>$('#'+id,contactForm)?.value.trim()||'';
      const fields={name:val('name'),email:val('email'),phone:val('phone'),subject:val('subject'),message:val('message')};
      const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email);
      const phone=fields.phone.replace(/[\s()-]/g,'');
      const phoneOk=/^(\+98|0098|0)?9\d{9}$/.test(phone) || /^0?\d{2,3}\d{7,8}$/.test(phone);
      if (Object.values(fields).some(v=>!v)) return showStatus($('#contact-status'),'لطفاً همه فیلدهای فرم را تکمیل کنید.','error');
      if (!emailOk) return showStatus($('#contact-status'),'لطفاً یک نشانی ایمیل معتبر وارد کنید.','error');
      if (!phoneOk) return showStatus($('#contact-status'),'شماره تماس واردشده معتبر به نظر نمی‌رسد.','error');
      const body=`نام: ${fields.name}\nایمیل: ${fields.email}\nتلفن: ${fields.phone}\nموضوع: ${fields.subject}\n\nمتن پیام:\n${fields.message}`;
      showStatus($('#contact-status'),'برنامه ایمیل شما با متن آماده باز می‌شود؛ برای ارسال نهایی، پیام را در آن تأیید کنید.');
      window.location.href=emailLink('info@parsnova.ir',`درخواست مشاوره: ${fields.subject}`,body);
    });
  }
  const newsletter=$('#newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit',e=>{
      e.preventDefault(); const field=$('input[type="email"]',newsletter); const value=field?.value.trim()||'';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showStatus($('#newsletter-status'),'لطفاً ایمیل معتبر وارد کنید.','error');
      showStatus($('#newsletter-status'),'برنامه ایمیل برای ثبت درخواست عضویت باز می‌شود؛ ارسال را تأیید کنید.');
      window.location.href=emailLink('info@parsnova.ir','درخواست عضویت در خبرنامه',`لطفاً این ایمیل را به خبرنامه پارس فناوری‌های نوآور اضافه کنید: ${value}`);
    });
  }

  // Privacy and terms links open useful local information instead of Base44 routes.
  $$('a[href="#privacy"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal('حریم خصوصی','اطلاعاتی که در فرم تماس وارد می‌کنید، در این نسخه فقط در برنامه ایمیل شما آماده می‌شود و به پایگاه داده‌ای ارسال یا ذخیره نمی‌شود. برای راه‌اندازی نسخه عملیاتی، باید سیاست نگهداری و پردازش داده‌ها در سمت سرور مشخص شود.');}));
  $$('a[href="#terms"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal('قوانین و مقررات','اطلاعات و نمونه‌کارهای این وب‌سایت برای معرفی خدمات شرکت ارائه شده‌اند. دامنه خدمات، زمان‌بندی، هزینه و تعهدات اجرایی هر پروژه باید در پیشنهاد فنی و قرارداد جداگانه مشخص شود.');}));

  // Avoid broken external routes and make the top-of-page links consistent.
  $$('a[href="#home"]').forEach(a=>a.setAttribute('aria-label',a.getAttribute('aria-label')||'بازگشت به ابتدای صفحه'));
})();
