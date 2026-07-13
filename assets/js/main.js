(function () {
  'use strict';

  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var headerActiveLabel = document.querySelector('.site-header__active');
  var searchInput = document.getElementById('nav-search');
  var noResultsEl = document.querySelector('.nav-empty');
  var sections = navItems
    .map(function (item) { return document.getElementById(item.dataset.targetId); })
    .filter(Boolean);

  /* ---- Scroll-spy ---------------------------------------------------- */
  function setActive(id) {
    navItems.forEach(function (item) {
      var isActive = item.dataset.targetId === id;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        var num = item.dataset.num || '';
        headerActiveLabel.textContent = num ? num + ' · ' + item.dataset.label : item.dataset.label;
      }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (el) { io.observe(el); });

    var cover = document.getElementById('cover');
    if (cover) {
      var coverIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) headerActiveLabel.textContent = 'Cover';
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      coverIo.observe(cover);
    }
  }

  /* ---- Live search (filters nav list only) ---------------------------- */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var anyVisible = false;
      navItems.forEach(function (item) {
        var label = (item.dataset.label || '').toLowerCase();
        var num = (item.dataset.num || '').toLowerCase();
        var matches = !q || label.indexOf(q) !== -1 || (num && num.indexOf(q) !== -1);
        item.style.display = matches ? '' : 'none';
        if (matches) anyVisible = true;
      });
      if (noResultsEl) {
        noResultsEl.hidden = anyVisible;
        noResultsEl.textContent = 'No sections match “' + searchInput.value + '”.';
      }
    });
  }

  /* ---- Mobile drawer ---------------------------------------------------- */
  var sidebar = document.querySelector('.sidebar');
  var menuBtn = document.querySelector('.site-header__menu-btn');
  var closeBtn = document.querySelector('.sidebar__close');
  var scrim = document.querySelector('.scrim');

  function openDrawer() {
    sidebar.classList.add('is-open');
    scrim.classList.add('is-visible');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    sidebar.classList.remove('is-open');
    scrim.classList.remove('is-visible');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var isOpen = sidebar.classList.contains('is-open');
      if (isOpen) { closeDrawer(); } else { openDrawer(); }
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (scrim) scrim.addEventListener('click', closeDrawer);
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 900px)').matches) closeDrawer();
    });
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();
