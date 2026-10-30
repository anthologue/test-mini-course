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

    // Tabs: Lesson and Quiz share the one page
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    var panels = {
      lesson: document.getElementById('panel-lesson'),
      quiz: document.getElementById('panel-quiz'),
      simulator: document.getElementById('panel-simulator')
    };
    var lessonSections = sections.filter(function (s) { return panels.lesson.contains(s); });

    function showTab(name) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-tab') === name;
        tab.setAttribute('aria-selected', on);
        tab.tabIndex = on ? 0 : -1;
        panels[tab.getAttribute('data-tab')].hidden = !on;
      });
      updateCurrent();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        showTab(tab.getAttribute('data-tab'));
        document.getElementById('main').scrollIntoView();
      });
      tab.addEventListener('keydown', function (e) {
        var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) { return; }
        var other = tabs[(i + step + tabs.length) % tabs.length];
        showTab(other.getAttribute('data-tab'));
        other.focus();
        e.preventDefault();
      });
    });

    // Buttons inside the lesson that open a tab (such as "Take the quiz")
    document.querySelectorAll('button[data-tab]:not(.tab)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showTab(btn.getAttribute('data-tab'));
        document.getElementById('main').scrollIntoView();
      });
    });

    // Jump to a section when a menu link or the title is chosen
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function goTo(id) {
      var target = document.getElementById(id);
      if (!target) { return; }
      // Open the tab the section lives in first
      Object.keys(panels).forEach(function (name) {
        if (panels[name].contains(target)) { showTab(name); }
      });
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

    // Quiz: each answer is marked as soon as it is chosen; the score shows once all are answered
    var quizForm = document.getElementById('quiz-form');
    var questions = Array.prototype.slice.call(quizForm.querySelectorAll('.quiz-q'));
    var score = document.querySelector('.quiz-score');
    var answered = 0;
    var correctCount = 0;

    quizForm.addEventListener('change', function (e) {
      var q = e.target.closest('.quiz-q');
      if (!q || q.disabled) { return; }

      var right = q.querySelector('input[value="' + q.dataset.correct + '"]');
      var isRight = e.target === right;
      var result = q.querySelector('.quiz-result');
      result.className = 'quiz-result ' + (isRight ? 'correct' : 'wrong');
      result.textContent = isRight
        ? '✓ Correct!'
        : '✗ Not quite. The answer is: ' + right.parentNode.textContent.trim();
      q.querySelector('.quiz-why').hidden = false;
      q.disabled = true;

      answered += 1;
      if (isRight) { correctCount += 1; }
      if (answered === questions.length) {
        score.querySelector('.quiz-score-text').textContent =
          'You scored ' + correctCount + ' out of ' + questions.length + '.';
        score.hidden = false;
        score.focus();
      }
    });

    document.querySelector('.quiz-retry').addEventListener('click', function () {
      quizForm.reset();
      questions.forEach(function (q) {
        q.disabled = false;
        q.querySelector('.quiz-result').textContent = '';
        q.querySelector('.quiz-result').className = 'quiz-result';
        q.querySelector('.quiz-why').hidden = true;
      });
      answered = 0;
      correctCount = 0;
      score.hidden = true;
      document.getElementById('title-quiz').scrollIntoView();
    });

    // Simulator: one scenario at a time, marked as soon as a role is chosen
    var simSteps = Array.prototype.slice.call(document.querySelectorAll('.sim-step'));
    var simScore = document.querySelector('.sim-score');
    var simIndex = 0;
    var simCorrect = 0;

    function showSimStep(i) {
      simIndex = i;
      simSteps.forEach(function (s, j) { s.hidden = j !== i; });
    }

    document.querySelector('.sim-steps').addEventListener('click', function (e) {
      var step = e.target.closest('.sim-step');
      var choice = e.target.closest('.sim-option');
      var next = e.target.closest('.sim-next');

      if (choice && !choice.disabled) {
        var right = step.querySelector('[data-correct]');
        var isRight = choice === right;
        step.querySelectorAll('.sim-option').forEach(function (b) { b.disabled = true; });
        right.classList.add('is-right');
        if (!isRight) { choice.classList.add('is-wrong'); }
        var result = step.querySelector('.sim-result');
        result.className = 'sim-result ' + (isRight ? 'correct' : 'wrong');
        result.textContent = isRight
          ? '✓ Correct!'
          : '✗ Not quite. The answer is: ' + right.textContent;
        step.querySelector('.sim-why').hidden = false;
        step.querySelector('.sim-next').hidden = false;
        if (isRight) { simCorrect += 1; }
        result.focus();
      }

      if (next) {
        if (simIndex < simSteps.length - 1) {
          showSimStep(simIndex + 1);
          simSteps[simIndex].querySelector('.sim-progress').focus();
        } else {
          simSteps.forEach(function (s) { s.hidden = true; });
          simScore.querySelector('.sim-score-text').textContent =
            'You matched ' + simCorrect + ' of ' + simSteps.length + ' scenarios.';
          simScore.hidden = false;
          simScore.focus();
        }
      }
    });

    simSteps.forEach(function (s) { s.querySelector('.sim-progress').tabIndex = -1; });

    document.querySelector('.sim-retry').addEventListener('click', function () {
      simSteps.forEach(function (s) {
        s.querySelectorAll('.sim-option').forEach(function (b) {
          b.disabled = false;
          b.classList.remove('is-right', 'is-wrong');
        });
        s.querySelector('.sim-result').textContent = '';
        s.querySelector('.sim-result').className = 'sim-result';
        s.querySelector('.sim-why').hidden = true;
        s.querySelector('.sim-next').hidden = true;
      });
      simCorrect = 0;
      simScore.hidden = true;
      showSimStep(0);
      document.getElementById('title-simulator').scrollIntoView();
    });

    showSimStep(0);

    // Highlight the section being read
    function setCurrent(index) {
      links.forEach(function (a, i) {
        if (i === index) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
    }

    function updateCurrent() {
      // On the Quiz and Simulator tabs, highlight that tab's own menu entry
      for (var name in panels) {
        if (name !== 'lesson' && !panels[name].hidden) {
          setCurrent(links.indexOf(nav.querySelector('a[href="#' + name + '"]')));
          return;
        }
      }
      var line = window.innerHeight * 0.3;
      var current = 0;
      lessonSections.forEach(function (s, i) {
        if (s.getBoundingClientRect().top <= line) { current = i; }
      });
      // At the very bottom the last section may be too short to reach the line.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        current = lessonSections.length - 1;
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

    // A link straight to the quiz (or to any section) should open on the right tab
    if (location.hash.length > 1 && document.getElementById(location.hash.slice(1))) {
      goTo(location.hash.slice(1));
    }
  });
})();
