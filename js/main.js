(function () {
  var STORAGE_KEY = 'course-theme';
  var root = document.documentElement;

  // Part 1: runs immediately (the script is loaded in the <head>) so the page
  // never flashes the wrong theme. Light is the default.
  function readSavedTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Saving is optional; the toggle still works for this visit.
    }
  }

  root.classList.remove('no-js');
  root.setAttribute('data-theme', readSavedTheme() === 'dark' ? 'dark' : 'light');

  // Part 2: needs the page to be loaded.
  document.addEventListener('DOMContentLoaded', function () {
    var themeButton = document.querySelector('.theme-btn');
    var menuButton = document.querySelector('.menu-btn');
    var nav = document.getElementById('site-nav');
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));

    // Theme toggle
    function syncThemeButton() {
      themeButton.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    }

    themeButton.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      saveTheme(next);
      syncThemeButton();
    });

    syncThemeButton();

    // Menu (drop-down on phones and tablets)
    function setMenu(open) {
      nav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function menuIsDropDown() {
      return window.getComputedStyle(menuButton).display !== 'none';
    }

    menuButton.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (menuIsDropDown()) {
          setMenu(false);
        }
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuButton.focus();
      }
    });

    // Quick check questions: show right or wrong straight away, then offer the
    // next section. Nothing is locked or saved, and the student can always scroll on.
    document.querySelectorAll('.checkin').forEach(function (checkin) {
      var choices = Array.prototype.slice.call(checkin.querySelectorAll('.choice'));
      var verdict = checkin.querySelector('.checkin__verdict');
      var explain = checkin.querySelector('.checkin__explain');
      var next = checkin.querySelector('.checkin__next');
      var answered = false;

      choices.forEach(function (choice) {
        choice.addEventListener('click', function () {
          if (answered) {
            return;
          }
          answered = true;

          var isRight = choice.hasAttribute('data-correct');
          choices.forEach(function (other) {
            other.setAttribute('aria-disabled', 'true');
            if (other.hasAttribute('data-correct')) {
              other.classList.add('is-correct');
            }
          });

          if (isRight) {
            verdict.textContent = 'Correct!';
            verdict.className = 'checkin__verdict is-correct';
          } else {
            choice.classList.add('is-wrong');
            verdict.textContent = 'Not quite. The correct answer is marked with a tick.';
            verdict.className = 'checkin__verdict is-wrong';
          }

          explain.hidden = false;
          next.hidden = false;
        });
      });
    });

    // Highlight the section being read
    function setCurrent(id) {
      links.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });

      document.querySelectorAll('main .slide').forEach(function (section) {
        observer.observe(section);
      });
    }
  });
})();
