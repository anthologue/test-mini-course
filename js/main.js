// Theme toggle, menu, and "current section" highlight.
// The lesson itself is plain HTML, so it reads fine if this file does not run.

(function () {
  var root = document.documentElement;
  var THEME_KEY = 'course-theme';

  // Runs in <head>: apply the saved theme before the page is drawn.
  root.classList.remove('no-js');
  root.classList.add('js');

  function readTheme() {
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked: ignore */ }
  }

  root.setAttribute('data-theme', readTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var themeBtn = document.querySelector('.theme-btn');
    var menuBtn = document.querySelector('.menu-btn');
    var nav = document.getElementById('site-nav');
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var sections = links.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    });

    // Theme toggle
    function syncThemeButton() {
      themeBtn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark');
    }
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      saveTheme(next);
      syncThemeButton();
    });
    syncThemeButton();

    // Menu (drop-down on small screens)
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open);
    }
    menuBtn.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    // Jump to a section when a menu link or the title is chosen
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function goTo(id) {
      var target = document.getElementById(id);
      if (!target) { return; }
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      var heading = target.querySelector('h1, h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      if (history.replaceState) { history.replaceState(null, '', '#' + id); }
    }
    document.querySelectorAll('.site-nav a, .brand').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setMenu(false);
        goTo(a.getAttribute('href').slice(1));
      });
    });

    // Check-in questions: mark the answer, explain it, then offer the next section
    document.querySelectorAll('.check').forEach(function (form) {
      var result = form.querySelector('.check-result');
      var why = form.querySelector('.check-why');
      var next = form.querySelector('.check-next');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var chosen = form.querySelector('input:checked');
        if (!chosen) {
          result.textContent = 'Pick an answer first.';
          return;
        }

        var right = form.querySelector('input[value="' + form.dataset.correct + '"]');
        var isRight = chosen === right;
        result.className = 'check-result ' + (isRight ? 'correct' : 'wrong');
        result.textContent = isRight
          ? '✓ Correct!'
          : '✗ Not quite. The answer is: ' + right.parentNode.textContent.trim();

        form.querySelectorAll('input, button').forEach(function (el) { el.disabled = true; });
        why.hidden = false;
        next.hidden = false;
        result.focus();
      });

      next.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(next.getAttribute('href').slice(1));
      });
    });

    // Highlight the section being read
    function setCurrent(index) {
      links.forEach(function (a, i) {
        if (i === index) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
    }

    function updateCurrent() {
      var line = window.innerHeight * 0.3;
      var current = 0;
      sections.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= line) { current = i; }
      });
      // At the very bottom the last section may be too short to reach the line.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = sections.length - 1;
      }
      setCurrent(current);
    }

    var waiting = false;
    window.addEventListener('scroll', function () {
      if (waiting) { return; }
      waiting = true;
      window.requestAnimationFrame(function () {
        waiting = false;
        updateCurrent();
      });
    }, { passive: true });
    window.addEventListener('resize', updateCurrent);
    updateCurrent();
  });
})();
