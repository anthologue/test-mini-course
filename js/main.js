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

    // Questions (used by the lesson quizzes and by the simulator): show right or
    // wrong as soon as a choice is picked. Nothing is saved between visits.
    // Returns reset() so the simulator can start over.
    function setUpQuestion(question, onAnswered) {
      var choices = Array.prototype.slice.call(question.querySelectorAll('.choice'));
      var verdict = question.querySelector('.question__verdict');
      var explain = question.querySelector('.question__explain');
      var next = question.querySelector('.sim__next');
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
            verdict.className = 'question__verdict is-correct';
          } else {
            choice.classList.add('is-wrong');
            verdict.textContent = 'Not quite. The correct answer is marked with a tick.';
            verdict.className = 'question__verdict is-wrong';
          }

          explain.hidden = false;
          if (next) {
            next.hidden = false;
          }
          onAnswered(isRight);
        });
      });

      return {
        reset: function () {
          answered = false;
          choices.forEach(function (choice) {
            choice.removeAttribute('aria-disabled');
            choice.classList.remove('is-correct', 'is-wrong');
          });
          verdict.textContent = '';
          verdict.className = 'question__verdict';
          explain.hidden = true;
          if (next) {
            next.hidden = true;
          }
        }
      };
    }

    // Course tabs: Lesson, Quiz and Simulator are all on this one page, and
    // only one of them shows at a time. Answers stay while you switch tabs.
    var tablist = document.querySelector('.tabs');
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    function selectTab(tab, options) {
      tabs.forEach(function (other) {
        var on = other === tab;
        other.setAttribute('aria-selected', on ? 'true' : 'false');
        other.tabIndex = on ? 0 : -1;
        document.getElementById(other.getAttribute('aria-controls')).hidden = !on;
      });
      if (options && options.focus) {
        tab.focus({ preventScroll: true });
      }
      if (options && options.scroll) {
        tablist.scrollIntoView({ block: 'start' });
      }
    }

    function tabFor(name) {
      return tabs.filter(function (tab) { return tab.getAttribute('data-tab') === name; })[0];
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        selectTab(tab, {});
      });

      tab.addEventListener('keydown', function (event) {
        var target = null;
        if (event.key === 'ArrowRight') {
          target = tabs[(index + 1) % tabs.length];
        } else if (event.key === 'ArrowLeft') {
          target = tabs[(index - 1 + tabs.length) % tabs.length];
        } else if (event.key === 'Home') {
          target = tabs[0];
        } else if (event.key === 'End') {
          target = tabs[tabs.length - 1];
        }
        if (target) {
          event.preventDefault();
          selectTab(target, { focus: true });
        }
      });
    });

    // Buttons that switch tab ("Take the quiz", "Review the lesson", "Try the simulator").
    document.querySelectorAll('[data-tab-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectTab(tabFor(button.getAttribute('data-tab-target')), { focus: true, scroll: true });
      });
    });

    // Links inside the page (menu, "Review the roles", ...) may point into a tab
    // that is not showing. Open that tab first, then go there.
    function tabForPanel(panel) {
      return document.getElementById(panel.getAttribute('aria-labelledby'));
    }

    function openTarget(id, event) {
      var target = document.getElementById(id);
      if (!target) {
        return;
      }
      var panel = target.closest('.tabpanel');
      var isTabSection = id === 'quiz' || id === 'simulator';
      if (!isTabSection && !(panel && panel.hidden)) {
        return; // an ordinary link on the visible tab: let the browser scroll
      }
      if (event) {
        event.preventDefault();
      }
      if (panel && panel.hidden) {
        selectTab(tabForPanel(panel), {});
      }
      (isTabSection ? tablist : target).scrollIntoView({ block: 'start' });
      try {
        window.history.replaceState(null, '', '#' + id);
      } catch (e) {
        // The address bar is only a nicety.
      }
    }

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href').length > 1) {
        openTarget(link.getAttribute('href').slice(1), event);
      }
    });

    window.addEventListener('hashchange', function () {
      openTarget(decodeURIComponent(window.location.hash.slice(1)), null);
    });

    if (window.location.hash.length > 1) {
      openTarget(decodeURIComponent(window.location.hash.slice(1)), null);
    }

    // Quiz: once every question is answered, show the score.
    var quiz = document.querySelector('.quiz');
    var quizQuestions = Array.prototype.slice.call(quiz.querySelectorAll('.question'));
    var quizSummary = quiz.querySelector('.quiz__summary');
    var quizAnswered = quiz.querySelector('.quiz__answered');
    var quizTotal = quizQuestions.length;
    var quizRight = 0;
    var quizCount = 0;

    var quizControllers = quizQuestions.map(function (question) {
      return setUpQuestion(question, function (isRight) {
        quizCount += 1;
        if (isRight) {
          quizRight += 1;
        }
        quizAnswered.textContent = quizCount;
        if (quizCount === quizTotal) {
          quiz.querySelector('.quiz__points').textContent = quizRight + ' of ' + quizTotal;
          quiz.querySelector('.quiz__message').textContent = quizRight === quizTotal
            ? 'Perfect score! You got every question right.'
            : quizRight >= Math.ceil(quizTotal * 0.75)
              ? 'Well done. Look back at the lesson for the ones you missed.'
              : 'Have another look at the lesson, then try again.';
          quizSummary.hidden = false;
        }
      });
    });

    quiz.querySelector('.quiz__restart').addEventListener('click', function () {
      quizRight = 0;
      quizCount = 0;
      quizAnswered.textContent = '0';
      quizSummary.hidden = true;
      quizControllers.forEach(function (controller) {
        controller.reset();
      });
      tablist.scrollIntoView({ block: 'start' });
      quizQuestions[0].querySelector('.question__q').focus({ preventScroll: true });
    });

    // Role-matching simulator: one scenario at a time, then a final score.
    document.querySelectorAll('.sim').forEach(function (sim) {
      var scenarios = Array.prototype.slice.call(sim.querySelectorAll('.scenario'));
      var scoreLabel = sim.querySelector('.sim__score');
      var points = sim.querySelector('.sim__points');
      var final = sim.querySelector('.sim__final');
      var total = scenarios.length;
      var current = 0;
      var score = 0;

      function show(index) {
        scenarios.forEach(function (scenario, i) {
          scenario.hidden = i !== index;
        });
        current = index;
      }

      function finish() {
        scenarios.forEach(function (scenario) {
          scenario.hidden = true;
        });
        scoreLabel.hidden = true;
        sim.querySelector('.sim__final-points').textContent = score + ' of ' + total;
        sim.querySelector('.sim__final-message').textContent = score === total
          ? 'Perfect! You matched every situation to the right AI role.'
          : score >= Math.ceil(total * 0.7)
            ? 'Nice work. Check slide 4 for the roles you missed, then try again.'
            : 'Worth another look at slide 4 (Roles for AI co-workers), then try again.';
        final.hidden = false;
        sim.querySelector('.sim__restart').focus({ preventScroll: true });
      }

      var controllers = scenarios.map(function (scenario, index) {
        var controller = setUpQuestion(scenario, function (isRight) {
          if (isRight) {
            score += 1;
          }
          points.textContent = score;
        });

        scenario.querySelector('.sim__next').addEventListener('click', function () {
          if (index === total - 1) {
            finish();
          } else {
            show(index + 1);
            var heading = scenarios[index + 1].querySelector('.question__q');
            heading.focus({ preventScroll: true });
            scenarios[index + 1].scrollIntoView({ block: 'nearest' });
          }
        });

        return controller;
      });

      sim.querySelector('.sim__restart').addEventListener('click', function () {
        score = 0;
        points.textContent = '0';
        controllers.forEach(function (controller) {
          controller.reset();
        });
        final.hidden = true;
        scoreLabel.hidden = false;
        show(0);
        scenarios[0].querySelector('.question__q').focus({ preventScroll: true });
      });

      show(0);
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
