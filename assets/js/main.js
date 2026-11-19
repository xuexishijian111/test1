/* CareBridge — 交互脚本（无依赖） */
(function () {
  'use strict';

  var d = document;

  /* ---------- 1. 头部滚动态 ---------- */
  var header = d.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. 移动端导航 ---------- */
  var toggle = d.getElementById('navToggle');
  var nav = d.getElementById('primaryNav');

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      d.body.classList.toggle('nav-open', open);
      d.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) setNav(false);
    });

    d.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) setNav(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('is-open')) setNav(false);
    });
  }

  /* ---------- 3. 滚动渐入 ---------- */
  var revealItems = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealItems.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 4. 字数统计 ---------- */
  var msg = d.getElementById('message');
  var counter = d.getElementById('charCount');
  if (msg && counter) {
    var updateCount = function () {
      counter.textContent = msg.value.length + ' / 2000';
    };
    updateCount();
    msg.addEventListener('input', updateCount);
  }

  /* ---------- 5. 回到顶部 ---------- */
  var toTop = d.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 640);
    }, { passive: true });

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 6. 表单：防重复提交 ---------- */
  var form = d.querySelector('.lead-form');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = true;
      btn.style.opacity = '.6';
      btn.style.pointerEvents = 'none';
      var label = btn.textContent;
      setTimeout(function () {
        // 若浏览器阻止提交，5 秒后恢复
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
      }, 6000);
      btn.dataset.label = label;
    });
  }

  /* ---------- 7. 锚点平滑滚动（带头部偏移） ---------- */
  d.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = d.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      var offset = (header ? header.offsetHeight : 0) + 16;
      var y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
