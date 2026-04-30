(function () {
  'use strict';

  var content = window.SITE_CONTENT;
  if (!content) {
    return;
  }

  var THEME_KEY = 'theme-preference';
  var LANG_KEY = 'language-preference';
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function getDefaultLang() {
    return content.i18n && content.i18n.defaultLang === 'en' ? 'en' : 'zh';
  }

  function isSupportedLang(lang) {
    var supportedLangs = content.i18n && Array.isArray(content.i18n.supportedLangs)
      ? content.i18n.supportedLangs
      : ['zh', 'en'];

    return supportedLangs.indexOf(lang) !== -1;
  }

  function getInitialLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(LANG_KEY);
    } catch (error) {}

    if (isSupportedLang(stored)) {
      return stored;
    }

    return getDefaultLang();
  }

  function persistLang(lang) {
    if (!isSupportedLang(lang)) {
      return;
    }

    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (error) {}
  }

  var initialLang = getInitialLang();
  var state = {
    lang: initialLang,
    locationLang: 'en',
    publicationFilter: 'all',
    publicationQuery: '',
    theme: 'light',
  };

  var refs = {
    navLinks: document.getElementById('nav-links'),
    langToggle: document.getElementById('lang-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    menuToggle: document.getElementById('menu-toggle'),
    header: document.querySelector('.site-header'),
    progressBar: document.getElementById('progress-bar'),
    hero: document.getElementById('hero-root'),
    about: document.getElementById('about-root'),
    education: document.getElementById('education-root'),
    projects: document.getElementById('projects-root'),
    publications: document.getElementById('publications-root'),
    location: document.getElementById('location-root'),
    contact: document.getElementById('contact-root'),
    footer: document.getElementById('footer-root')
  };

  var sectionObserver = null;
  var revealObserver = null;
  var reducedMotionMedia = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var progressState = {
    target: 0,
    displayed: 0,
    rafId: null,
    reducedMotion: reducedMotionMedia ? reducedMotionMedia.matches : false
  };
  var scrollState = {
    rafId: null
  };
  var clickFxState = {
    canvas: null,
    ctx: null,
    particles: [],
    rafId: null,
    lastFrameTs: 0,
    reducedMotion: reducedMotionMedia ? reducedMotionMedia.matches : false,
    colorsLight: ['#2e58cf', '#af3fd0', '#1b96c3', '#cf6548', '#2a9b75', '#4f5f8a', '#d34e5b'],
    colorsDark: ['#8aa7ff', '#d593ff', '#82d8ff', '#ffb19f', '#8ce8c7', '#bdc8e8', '#ff9ea7']
  };
  var mapState = {
    map: null,
    leafletLoading: false,
    leafletLoaded: false,
    queue: []
  };
  var initialScrollGuard = {
    active: false,
    userInteracted: false,
    timeoutId: null,
    intervalId: null
  };

  function disableInitialScrollGuard() {
    initialScrollGuard.active = false;
    initialScrollGuard.userInteracted = true;
    if (initialScrollGuard.timeoutId !== null) {
      window.clearTimeout(initialScrollGuard.timeoutId);
      initialScrollGuard.timeoutId = null;
    }
    if (initialScrollGuard.intervalId !== null) {
      window.clearInterval(initialScrollGuard.intervalId);
      initialScrollGuard.intervalId = null;
    }
  }

  function startInitialScrollGuard() {
    initialScrollGuard.active = true;
    initialScrollGuard.userInteracted = false;

    if (initialScrollGuard.timeoutId !== null) {
      window.clearTimeout(initialScrollGuard.timeoutId);
    }
    if (initialScrollGuard.intervalId !== null) {
      window.clearInterval(initialScrollGuard.intervalId);
    }

    initialScrollGuard.intervalId = window.setInterval(function () {
      if (!initialScrollGuard.active || initialScrollGuard.userInteracted) {
        return;
      }
      var top = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (top > 2) {
        window.scrollTo(0, 0);
      }
    }, 120);
    initialScrollGuard.timeoutId = null;
  }

  var scrollLockState = {
    active: false,
    targetY: 0,
    intervalId: null,
    timeoutId: null
  };

  function stopScrollLock() {
    scrollLockState.active = false;
    if (scrollLockState.intervalId !== null) {
      window.clearInterval(scrollLockState.intervalId);
      scrollLockState.intervalId = null;
    }
    if (scrollLockState.timeoutId !== null) {
      window.clearTimeout(scrollLockState.timeoutId);
      scrollLockState.timeoutId = null;
    }
  }

  function startScrollLock(targetY, durationMs) {
    stopScrollLock();

    scrollLockState.active = true;
    scrollLockState.targetY = Math.max(0, targetY || 0);
    window.scrollTo(0, scrollLockState.targetY);

    scrollLockState.intervalId = window.setInterval(function () {
      if (!scrollLockState.active) {
        return;
      }

      var currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (Math.abs(currentY - scrollLockState.targetY) > 2) {
        window.scrollTo(0, scrollLockState.targetY);
      }
    }, 120);

    scrollLockState.timeoutId = window.setTimeout(function () {
      stopScrollLock();
    }, Math.max(600, durationMs || 1800));
  }

  function forceScrollPosition(y) {
    var targetY = Math.max(0, y || 0);
    window.scrollTo(0, targetY);
    updateProgressBar(true);
  }

  function safeFocusWithoutScroll(element, fallbackY) {
    if (!element || typeof element.focus !== 'function') {
      return;
    }

    try {
      element.focus({ preventScroll: true });
      return;
    } catch (error) {}

    element.focus();
    forceScrollPosition(fallbackY);
  }

  function rerenderWithScrollLock(renderFn, options) {
    var opts = options || {};
    var stableY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var lockDuration = Math.max(1200, opts.lockDuration || 2800);
    var afterRender = typeof opts.afterRender === 'function' ? opts.afterRender : null;

    startScrollLock(stableY, lockDuration);

    if (opts.clearHash && window.history && window.history.replaceState && /^https?:$/i.test(window.location.protocol || '')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    renderFn();

    var restore = function () {
      if (!scrollLockState.active) {
        return;
      }
      forceScrollPosition(scrollLockState.targetY);
    };

    window.requestAnimationFrame(function () {
      restore();
      if (afterRender) {
        afterRender(scrollLockState.targetY);
      }
      restore();
    });

    window.setTimeout(restore, 120);
    window.setTimeout(restore, 420);
    window.setTimeout(restore, 900);
  }

  function resetInitialScrollPosition() {
    try {
      if (window.history && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch (error) {}

    try {
      if (window.location && window.location.hash) {
        var isHttp = /^https?:$/i.test(window.location.protocol || '');
        if (isHttp && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          window.location.hash = '';
        }
      }
    } catch (error) {}

    window.scrollTo(0, 0);
  }

  function pick(value, lang) {
    var useLang = lang || state.lang;
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }

    if (typeof value === 'object') {
      return String(value[useLang] || value.zh || value.en || '');
    }

    return String(value);
  }

  function escapeHTML(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).replace(/[&<>"']/g, function (char) {
      return htmlEscapes[char];
    });
  }

  function escapeAttr(value) {
    return escapeHTML(value);
  }

  function safePick(value, lang) {
    return escapeHTML(pick(value, lang));
  }

  function makeSectionHeader(title, subtitle) {
    return (
      '<header class="section-header">' +
      '<h2 class="section-title">' + safePick(title) + '</h2>' +
      '<p class="section-subtitle">' + safePick(subtitle) + '</p>' +
      '</header>'
    );
  }

  function setMeta() {
    document.title = pick(content.siteMeta.title);

    var metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pick(content.siteMeta.description));

    document.documentElement.setAttribute('lang', state.lang === 'zh' ? 'zh-CN' : 'en');
  }

  function updateLangToggleLabel() {
    if (!refs.langToggle) {
      return;
    }

    var nextLang = state.lang === 'zh' ? 'en' : 'zh';
    refs.langToggle.textContent = pick(content.i18n.labels[nextLang], nextLang);
    refs.langToggle.setAttribute('aria-label', state.lang === 'zh' ? 'Switch to English' : '\u5207\u6362\u5230\u4e2d\u6587');
  }

  function hintLangToggle() {
    if (!refs.langToggle) {
      return;
    }

    window.setTimeout(function () {
      if (!refs.langToggle) {
        return;
      }

      refs.langToggle.classList.remove('lang-toggle-hint');
      void refs.langToggle.offsetWidth;
      refs.langToggle.classList.add('lang-toggle-hint');

      var cleared = false;
      var clearHint = function () {
        if (cleared || !refs.langToggle) {
          return;
        }
        cleared = true;
        refs.langToggle.classList.remove('lang-toggle-hint');
        refs.langToggle.removeEventListener('animationend', handleEnd);
      };

      var handleEnd = function (event) {
        if (event.animationName !== 'lang-toggle-nudge') {
          return;
        }
        clearHint();
      };

      refs.langToggle.addEventListener('animationend', handleEnd);
      window.setTimeout(clearHint, 2600);
    }, 520);
  }
  function getInitialTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (error) {}

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return 'light';
  }

  function applyTheme(theme) {
    state.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  function getThemeToggleText() {
    var nextTheme = state.theme === 'dark' ? 'light' : 'dark';

    if (state.lang === 'zh') {
      return nextTheme === 'dark' ? '\u6df1\u8272' : '\u6d45\u8272';
    }

    return nextTheme === 'dark' ? 'Dark' : 'Light';
  }

  function updateThemeToggleLabel() {
    if (!refs.themeToggle) {
      return;
    }

    var nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    refs.themeToggle.textContent = getThemeToggleText();
    refs.themeToggle.setAttribute(
      'aria-label',
      state.lang === 'zh'
        ? nextTheme === 'dark'
          ? '\u5207\u6362\u5230\u6df1\u8272\u4e3b\u9898'
          : '\u5207\u6362\u5230\u6d45\u8272\u4e3b\u9898'
        : 'Switch color theme'
    );
  }

  function renderNavigation() {
    if (!refs.navLinks) {
      return;
    }

    refs.navLinks.innerHTML = content.navigation
      .map(function (item) {
        return (
          '<li>' +
          '<a class="nav-link" data-scroll-link data-section="' +
          escapeAttr(item.id) +
          '" href="#' +
          escapeAttr(item.id) +
          '">' +
          safePick(item.label) +
          '</a>' +
          '</li>'
        );
      })
      .join('');
  }

  function renderHero() {
    var profile = content.profile;

    var introHtml = profile.intro
      .map(function (paragraph) {
        return '<p>' + safePick(paragraph) + '</p>';
      })
      .join('');

    var socialHtml = profile.socials
      .map(function (social) {
        return (
          '<li><a href="' +
          escapeAttr(social.url) +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          escapeAttr(social.ariaLabel || social.label) +
          '">' +
          escapeHTML(social.label) +
          '</a></li>'
        );
      })
      .join('');

    var cvHtml = profile.cvLinks
      .map(function (cvItem) {
        return (
          '<a href="' +
          escapeAttr(cvItem.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          safePick(cvItem.label) +
          '</a>'
        );
      })
      .join('');

    refs.hero.innerHTML =
      '<article class="hero-layout">' +
      '<div class="hero-avatar-wrap">' +
      '<img class="hero-avatar" src="' +
      escapeAttr(profile.avatar) +
      '" alt="' +
      safePick(profile.avatarAlt) +
      '" />' +
      '</div>' +
      '<div>' +
      '<h1 class="hero-name">' +
      safePick(profile.name) +
      '</h1>' +
      '<p class="hero-role">' +
      safePick(profile.role) +
      '</p>' +
      '<p class="hero-contact">' +
      safePick(profile.affiliation) +
      ' &middot; <a href="' +
      escapeAttr('mailto:' + profile.email) +
      '">' +
      escapeHTML(profile.email) +
      '</a></p>' +
      '<div class="hero-summary">' +
      introHtml +
      '</div>' +
      '<ul class="social-list">' +
      socialHtml +
      '</ul>' +
      '<div class="hero-cv">' +
      cvHtml +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function renderAbout() {
    var section = content.sections.about;

    var paragraphs = section.paragraphs
      .map(function (paragraph) {
        return '<p>' + safePick(paragraph) + '</p>';
      })
      .join('');

    var highlights = section.highlights
      .map(function (item) {
        return '<li>' + safePick(item) + '</li>';
      })
      .join('');

    refs.about.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<div class="section-body">' +
      paragraphs +
      '<ul class="section-list">' +
      highlights +
      '</ul>' +
      '</div>';
  }

  function renderEducation() {
    var section = content.sections.education;

    var timeline = section.items
      .map(function (item) {
        var details = item.details
          .map(function (detail) {
            return '<li>' + safePick(detail) + '</li>';
          })
          .join('');
        var emblemHtml = '';
        if (item.emblem) {
          emblemHtml =
            '<img class="school-emblem" src="' +
            escapeAttr(item.emblem) +
            '" alt="' +
            safePick(item.emblemAlt || item.institution) +
            '" loading="eager" decoding="async" />';
        }
        var institutionHtml = '<h3 class="card-title">' + safePick(item.institution) + '</h3>';
        if (state.lang === 'zh' && item.wordmarkZh) {
          var institutionZh = pick(item.institution, 'zh');
          var tierStart = institutionZh.indexOf('·');
          var tierText = '';
          if (tierStart > -1) {
            tierText = institutionZh.slice(tierStart).trim();
          }
          var wordmarkClass = 'school-wordmark';
          if (item.wordmarkClass) {
            wordmarkClass += ' ' + item.wordmarkClass;
          }
          institutionHtml =
            '<h3 class="card-title school-title-wordmark">' +
            '<img class="' +
            escapeAttr(wordmarkClass) +
            '" src="' +
            escapeAttr(item.wordmarkZh) +
            '" alt="' +
            safePick(item.wordmarkAlt || item.institution, 'zh') +
            '" loading="eager" decoding="async" />' +
            (tierText ? '<span class="school-tier">' + escapeHTML(tierText) + '</span>' : '') +
            '</h3>';
        }

        return (
          '<article class="timeline-item">' +
          '<div class="timeline-head">' +
          '<div class="timeline-school">' +
          emblemHtml +
          institutionHtml +
          '</div>' +
          '<span class="timeline-date">' +
          escapeHTML(item.period) +
          '</span>' +
          '</div>' +
          '<p class="card-meta">' +
          safePick(item.degree) +
          '</p>' +
          '<ul class="section-list">' +
          details +
          '</ul>' +
          '</article>'
        );
      })
      .join('');

    refs.education.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<div class="timeline">' +
      timeline +
      '</div>';
  }

  function renderProjects() {
    var section = content.sections.projects;

    var items = section.items
      .map(function (item) {
        var tags = item.tags
          .map(function (tag) {
            return '<span class="pub-tag">' + escapeHTML(tag) + '</span>';
          })
          .join(' ');

        return (
          '<article class="card">' +
          '<h3 class="card-title">' +
          safePick(item.title) +
          '</h3>' +
          '<p class="card-meta">' +
          escapeHTML(item.period) +
          '</p>' +
          '<p>' +
          safePick(item.description) +
          '</p>' +
          '<div class="pub-head">' +
          tags +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    refs.projects.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<div class="card-grid">' +
      items +
      '</div>';
  }

  function buildPublicationSearchText(item) {
    return [pick(item.title), pick(item.authors), item.venue, item.type, String(item.year), item.tags.join(' ')]
      .join(' ')
      .toLowerCase();
  }

  function renderPublications() {
    var section = content.sections.publications;
    var refereedLabel = state.lang === 'zh' ? '\u540c\u884c\u8bc4\u5ba1' : 'Refereed';
    var manuscriptLabel = state.lang === 'zh' ? '\u624b\u7a3f' : 'Manuscripts';

    var filters = section.filters
      .map(function (filter) {
        var activeClass = state.publicationFilter === filter.key ? ' is-active' : '';
        return (
          '<button class="filter-btn' +
          activeClass +
          '" type="button" data-filter="' +
          escapeAttr(filter.key) +
          '">' +
          safePick(filter.label) +
          '</button>'
        );
      })
      .join('');

    var items = section.items
      .map(function (item) {
        var tags = item.tags
          .map(function (tag) {
            return '<span class="pub-tag">' + escapeHTML(tag) + '</span>';
          })
          .join(' ');

        var links = item.links
          .map(function (link) {
            return (
              '<a href="' +
              escapeAttr(link.url) +
              '" target="_blank" rel="noopener noreferrer">' +
              escapeHTML(link.label) +
              '</a>'
            );
          })
          .join('');

        return (
          '<article class="publication-card" data-type="' +
          escapeAttr(item.type) +
          '" data-search="' +
          escapeAttr(buildPublicationSearchText(item)) +
          '">' +
          '<div class="pub-head">' +
          '<span class="pub-year">' +
          escapeHTML(item.year) +
          '</span>' +
          '<span class="pub-type">' +
          escapeHTML(item.type) +
          '</span>' +
          '<span class="pub-tag">' +
          escapeHTML(item.venue) +
          '</span>' +
          tags +
          '</div>' +
          '<h3 class="card-title">' +
          safePick(item.title) +
          '</h3>' +
          '<p class="card-meta">' +
          safePick(item.authors) +
          '</p>' +
          '<div class="pub-links">' +
          links +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    refs.publications.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<div class="publication-panel">' +
      '<div class="publication-toolbar">' +
      '<div class="publication-stats">' +
      '<span class="stat-pill"><strong id="stat-refereed">0</strong> ' +
      escapeHTML(refereedLabel) +
      '</span>' +
      '<span class="stat-pill"><strong id="stat-manuscript">0</strong> ' +
      escapeHTML(manuscriptLabel) +
      '</span>' +
      '</div>' +
      '<input id="pub-search" class="publication-search" type="text" placeholder="' +
      safePick(section.searchPlaceholder) +
      '" />' +
      '<div class="filter-row">' +
      filters +
      '</div>' +
      '</div>' +
      '<div class="pub-list" id="pub-list">' +
      items +
      '</div>' +
      '<div id="pub-empty" class="pub-empty">' +
      safePick(section.emptyText) +
      '</div>' +
      '<p><a class="ghost-button" href="#">' +
      safePick(section.fullListLabel) +
      '</a></p>' +
      '</div>';

    bindPublicationControls();
    applyPublicationFilters();
  }

  function bindPublicationControls() {
    var searchInput = document.getElementById('pub-search');
    var filterButtons = document.querySelectorAll('.filter-btn');

    if (searchInput) {
      searchInput.value = state.publicationQuery;
      searchInput.addEventListener('input', function (event) {
        state.publicationQuery = event.target.value.toLowerCase().trim();
        applyPublicationFilters();
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.publicationFilter = button.getAttribute('data-filter') || 'all';
        filterButtons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        applyPublicationFilters();
      });
    });
  }

  function applyPublicationFilters() {
    var cards = document.querySelectorAll('.publication-card');
    var refereedCount = 0;
    var manuscriptCount = 0;
    var visibleCount = 0;

    cards.forEach(function (card) {
      var type = card.getAttribute('data-type') || '';
      var searchText = card.getAttribute('data-search') || '';

      var matchesFilter = state.publicationFilter === 'all' || type === state.publicationFilter;
      var matchesQuery = state.publicationQuery === '' || searchText.indexOf(state.publicationQuery) !== -1;
      var visible = matchesFilter && matchesQuery;

      card.classList.toggle('hidden', !visible);

      if (visible) {
        visibleCount += 1;
        if (type === 'manuscript') {
          manuscriptCount += 1;
        } else {
          refereedCount += 1;
        }
      }
    });

    var refereed = document.getElementById('stat-refereed');
    var manuscript = document.getElementById('stat-manuscript');
    var empty = document.getElementById('pub-empty');

    if (refereed) {
      refereed.textContent = String(refereedCount);
    }

    if (manuscript) {
      manuscript.textContent = String(manuscriptCount);
    }

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  function getAddressToggleText() {
    if (state.lang === 'zh') {
      return state.locationLang === 'zh' ? '\u663e\u793a\u82f1\u6587\u5730\u5740' : '\u663e\u793a\u4e2d\u6587\u5730\u5740';
    }

    return state.locationLang === 'en' ? 'Show Chinese address' : 'Show English address';
  }

  function shouldUseGoogleMapOnMobileZh() {
    if (!window.matchMedia) {
      return false;
    }
    return state.locationLang === 'zh' && window.matchMedia('(max-width: 768px)').matches;
  }

  function resolveLocationMapEmbedUrl(section) {
    if (!section) {
      return '';
    }

    var mapValue = section.mapEmbedUrl;
    if (mapValue && typeof mapValue === 'object') {
      if (shouldUseGoogleMapOnMobileZh() && mapValue.en) {
        return String(mapValue.en);
      }
      return String(
        mapValue[state.locationLang] ||
        mapValue[state.lang] ||
        mapValue.zh ||
        mapValue.en ||
        ''
      );
    }

    return pick(mapValue);
  }


  function flushLeafletQueue(success) {
    var pending = mapState.queue.slice();
    mapState.queue.length = 0;
    pending.forEach(function (callback) {
      callback(success);
    });
  }

  function ensureLeafletLoaded(callback) {
    if (window.L && window.L.map) {
      mapState.leafletLoaded = true;
      callback(true);
      return;
    }

    mapState.queue.push(callback);
    if (mapState.leafletLoading) {
      return;
    }

    mapState.leafletLoading = true;

    if (!document.getElementById('leaflet-style')) {
      var stylesheet = document.createElement('link');
      stylesheet.id = 'leaflet-style';
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      stylesheet.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      stylesheet.crossOrigin = '';
      document.head.appendChild(stylesheet);
    }

    var existingScript = document.getElementById('leaflet-script');
    if (existingScript) {
      var existingState = existingScript.getAttribute('data-state');
      if (existingState === 'loading') {
        existingScript.addEventListener('load', function () {
          mapState.leafletLoading = false;
          mapState.leafletLoaded = !!(window.L && window.L.map);
          flushLeafletQueue(mapState.leafletLoaded);
        }, { once: true });
        existingScript.addEventListener('error', function () {
          mapState.leafletLoading = false;
          mapState.leafletLoaded = false;
          flushLeafletQueue(false);
        }, { once: true });
        return;
      }

      if (existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    }

    var script = document.createElement('script');
    script.id = 'leaflet-script';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    script.setAttribute('data-state', 'loading');

    script.onload = function () {
      script.setAttribute('data-state', 'loaded');
      mapState.leafletLoading = false;
      mapState.leafletLoaded = !!(window.L && window.L.map);
      flushLeafletQueue(mapState.leafletLoaded);
    };

    script.onerror = function () {
      script.setAttribute('data-state', 'error');
      mapState.leafletLoading = false;
      mapState.leafletLoaded = false;
      flushLeafletQueue(false);
    };

    document.head.appendChild(script);
  }

  function destroyAmapInteractiveMap() {
    if (typeof mapState === 'undefined' || !mapState) {
      return;
    }

    if (mapState.map) {
      mapState.map.remove();
      mapState.map = null;
    }
  }

  function renderMapFallback(container, fallbackUrl, titleText) {
    if (!container) {
      return;
    }

    if (fallbackUrl) {
      container.innerHTML =
        '<iframe class="map-embed-frame" src="' +
        escapeAttr(fallbackUrl) +
        '" title="' +
        escapeAttr(titleText) +
        '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
      return;
    }

    container.innerHTML = '<p class="map-fallback-text">' + escapeHTML(state.lang === 'zh' ? '\u5730\u56fe\u52a0\u8f7d\u5931\u8d25\u3002' : 'Map failed to load.') + '</p>';
  }

  function initAmapInteractiveMap(section) {
    var mapRoot = document.getElementById('amap-interactive-map');
    if (!mapRoot || !section.amapTile) {
      return;
    }

    var lng = parseFloat(section.amapTile.lng);
    var lat = parseFloat(section.amapTile.lat);
    var zoom = parseInt(section.amapTile.zoom, 10);
    var fallbackUrl = resolveLocationMapEmbedUrl(section);
    var titleText = pick(section.mapAlt);

    if (!isFinite(lng) || !isFinite(lat) || !isFinite(zoom)) {
      renderMapFallback(mapRoot, fallbackUrl, titleText);
      return;
    }

    mapRoot.innerHTML = '<div class="map-loading">' + escapeHTML(state.lang === 'zh' ? '\u5730\u56fe\u52a0\u8f7d\u4e2d...' : 'Loading map...') + '</div>';

    ensureLeafletLoaded(function (loaded) {
      if (!document.getElementById('amap-interactive-map')) {
        return;
      }

      if (!loaded || !window.L || !window.L.map) {
        renderMapFallback(mapRoot, fallbackUrl, titleText);
        return;
      }

      destroyAmapInteractiveMap();
      mapRoot.innerHTML = '';

      mapState.map = window.L.map(mapRoot, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true
      });
      mapState.map.setView([lat, lng], zoom);

      window.L.tileLayer(
        'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}',
        {
          subdomains: ['1', '2', '3', '4'],
          minZoom: 3,
          maxZoom: 19,
          detectRetina: true,
          attribution: '&copy; AutoNavi'
        }
      ).addTo(mapState.map);

      window.L.circleMarker([lat, lng], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: '#4c96e9',
        fillOpacity: 0.96
      }).addTo(mapState.map);

      window.setTimeout(function () {
        if (mapState.map) {
          mapState.map.invalidateSize();
        }
      }, 0);
    });
  }

  function bindAddressToggleHandler() {
    var toggle = document.getElementById('address-toggle');
    if (!toggle || toggle.hasAttribute('data-address-toggle-bound')) {
      return;
    }

    toggle.setAttribute('data-address-toggle-bound', 'true');
    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      state.locationLang = state.locationLang === 'zh' ? 'en' : 'zh';
      rerenderWithScrollLock(function () {
        renderLocation();
      }, {
        lockDuration: 1200,
        afterRender: function (stableY) {
          var nextToggle = document.getElementById('address-toggle');
          safeFocusWithoutScroll(nextToggle, stableY);
        }
      });
    });
  }

  function bindLocationFrameLoadGuard() {
    var mapFrame = refs.location ? refs.location.querySelector('.map-embed--inner') : null;
    if (mapFrame && !mapFrame.hasAttribute('data-scroll-lock-bound')) {
      mapFrame.setAttribute('data-scroll-lock-bound', 'true');
      mapFrame.addEventListener('load', function () {
        if (!scrollLockState.active) {
          return;
        }
        forceScrollPosition(scrollLockState.targetY);
      });
    }
  }

  function renderLocation() {
    var section = content.sections.location;
    var mapEmbedUrl = resolveLocationMapEmbedUrl(section);
    var mapHtml = '';
    var amapOpenUrl = pick(section.amapOpenUrl);
    var amapOpenHtml = '';
    var mapMode = pick(section.mapMode);
    var currentCard = refs.location ? refs.location.querySelector('.location-card') : null;
    var currentMapFrame = currentCard ? currentCard.querySelector('.map-embed--inner') : null;
    var canPatchInPlace =
      !!currentCard &&
      mapMode !== 'amapTile' &&
      !!mapEmbedUrl &&
      !!currentMapFrame &&
      currentMapFrame.getAttribute('src') === mapEmbedUrl;

    destroyAmapInteractiveMap();

    if (canPatchInPlace) {
      var header = refs.location.querySelector('.section-header');
      if (header) {
        var titleEl = header.querySelector('.section-title');
        var subtitleEl = header.querySelector('.section-subtitle');
        if (titleEl) {
          titleEl.textContent = pick(section.title);
        }
        if (subtitleEl) {
          subtitleEl.textContent = pick(section.subtitle);
        }
      }

      var toggleEl = document.getElementById('address-toggle');
      if (toggleEl) {
        toggleEl.setAttribute('aria-label', pick(section.toggleLabel));
      }

      var zhAddress = document.getElementById('address-zh');
      if (zhAddress) {
        zhAddress.innerHTML = section.addressZh.map(function (line) {
          return '<p>' + escapeHTML(line) + '</p>';
        }).join('');
      }

      var enAddress = document.getElementById('address-en');
      if (enAddress) {
        enAddress.innerHTML = section.addressEn.map(function (line) {
          return '<p>' + escapeHTML(line) + '</p>';
        }).join('');
      }

      var mapNode = currentCard.querySelector('.map-embed-crop');
      if (mapNode) {
        mapNode.setAttribute('aria-label', pick(section.mapAlt));
      }
      currentMapFrame.setAttribute('title', pick(section.mapAlt));

      var mapActions = currentCard.querySelector('.map-actions');
      if (amapOpenUrl) {
        if (!mapActions) {
          mapActions = document.createElement('p');
          mapActions.className = 'map-actions';
          currentCard.appendChild(mapActions);
        }
        mapActions.innerHTML =
          '<a class="map-open-link" href="' +
          escapeAttr(amapOpenUrl) +
          '" target="_blank" rel="noopener noreferrer">' +
          safePick(section.amapOpenLabel) +
          '</a>';
      } else if (mapActions && mapActions.parentNode) {
        mapActions.parentNode.removeChild(mapActions);
      }

      updateAddressVisibility();
      bindLocationFrameLoadGuard();
      bindAddressToggleHandler();
      return;
    }

    if (mapMode === 'amapTile' && section.amapTile) {
      mapHtml =
        '<div class="map-embed amap-interactive-map" id="amap-interactive-map" data-lng="' +
        escapeAttr(section.amapTile.lng) +
        '" data-lat="' +
        escapeAttr(section.amapTile.lat) +
        '" data-zoom="' +
        escapeAttr(section.amapTile.zoom) +
        '" aria-label="' +
        safePick(section.mapAlt) +
        '"></div>';
    } else if (mapEmbedUrl) {
      mapHtml =
        '<div class="map-embed-crop" aria-label="' +
        safePick(section.mapAlt) +
        '">' +
        '<iframe class="map-embed map-embed--inner" src="' +
        escapeAttr(mapEmbedUrl) +
        '" title="' +
        safePick(section.mapAlt) +
        '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
        '</div>';
    } else {
      mapHtml =
        '<img class="map-placeholder" src="' +
        escapeAttr(section.mapImage) +
        '" alt="' +
        safePick(section.mapAlt) +
        '" />';
    }

    if (amapOpenUrl) {
      amapOpenHtml =
        '<p class="map-actions">' +
        '<a class="map-open-link" href="' +
        escapeAttr(amapOpenUrl) +
        '" target="_blank" rel="noopener noreferrer">' +
        safePick(section.amapOpenLabel) +
        '</a>' +
        '</p>';
    }

    refs.location.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<article class="card location-card">' +
      '<button id="address-toggle" class="address-toggle" type="button" aria-label="' +
      safePick(section.toggleLabel) +
      '">' +
      escapeHTML(getAddressToggleText()) +
      '</button>' +
      '<div id="address-zh">' +
      section.addressZh.map(function (line) {
        return '<p>' + escapeHTML(line) + '</p>';
      }).join('') +
      '</div>' +
      '<div id="address-en">' +
      section.addressEn.map(function (line) {
        return '<p>' + escapeHTML(line) + '</p>';
      }).join('') +
      '</div>' +
      mapHtml +
      amapOpenHtml +
      '</article>';

    initAmapInteractiveMap(section);
    updateAddressVisibility();
    bindLocationFrameLoadGuard();
    bindAddressToggleHandler();
  }

  function updateAddressVisibility() {
    var zhAddress = document.getElementById('address-zh');
    var enAddress = document.getElementById('address-en');
    var toggle = document.getElementById('address-toggle');

    if (!zhAddress || !enAddress) {
      return;
    }

    var showZh = state.locationLang === 'zh';
    zhAddress.classList.toggle('hidden', !showZh);
    enAddress.classList.toggle('hidden', showZh);

    if (toggle) {
      toggle.textContent = getAddressToggleText();
    }
  }

  function renderContact() {
    var section = content.sections.contact;

    var methods = section.methods
      .map(function (method) {
        return (
          '<article class="contact-item">' +
          '<p class="contact-label">' +
          safePick(method.label) +
          '</p>' +
          '<p class="contact-value"><a href="' +
          escapeAttr(method.href) +
          '" target="_blank" rel="noopener noreferrer">' +
          safePick(method.value) +
          '</a></p>' +
          '</article>'
        );
      })
      .join('');

    refs.contact.innerHTML =
      makeSectionHeader(section.title, section.subtitle) +
      '<div class="contact-grid">' +
      methods +
      '</div>';
  }

  function renderFooter() {
    refs.footer.innerHTML = '<p>' + safePick(content.footer.text) + '</p>';
  }

  function renderAll() {
    setMeta();
    renderNavigation();
    renderHero();
    renderAbout();
    renderEducation();
    renderProjects();
    renderPublications();
    renderLocation();
    renderContact();
    renderFooter();
    updateLangToggleLabel();
    updateThemeToggleLabel();
  }

  function getScrollProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollableHeight <= 0 ? 0 : (scrollTop / scrollableHeight) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  function renderProgressBar(progress) {
    if (!refs.progressBar) {
      return;
    }

    refs.progressBar.style.transform = 'scaleX(' + (progress / 100).toFixed(4) + ')';
  }

  function stepProgressBarAnimation() {
    var diff = progressState.target - progressState.displayed;

    if (Math.abs(diff) < 0.06) {
      progressState.displayed = progressState.target;
      renderProgressBar(progressState.displayed);
      progressState.rafId = null;
      return;
    }

    progressState.displayed += diff * 0.22;
    renderProgressBar(progressState.displayed);
    progressState.rafId = window.requestAnimationFrame(stepProgressBarAnimation);
  }

  function updateProgressBar(forceImmediate) {
    if (!refs.progressBar) {
      return;
    }

    progressState.target = getScrollProgress();

    if (forceImmediate || progressState.reducedMotion) {
      if (progressState.rafId !== null) {
        window.cancelAnimationFrame(progressState.rafId);
        progressState.rafId = null;
      }
      progressState.displayed = progressState.target;
      renderProgressBar(progressState.displayed);
      return;
    }

    if (progressState.rafId === null) {
      progressState.rafId = window.requestAnimationFrame(stepProgressBarAnimation);
    }
  }

  function resizeClickParticleCanvas() {
    if (!clickFxState.canvas || !clickFxState.ctx) {
      return;
    }

    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    clickFxState.canvas.width = Math.round(window.innerWidth * dpr);
    clickFxState.canvas.height = Math.round(window.innerHeight * dpr);
    clickFxState.canvas.style.width = window.innerWidth + 'px';
    clickFxState.canvas.style.height = window.innerHeight + 'px';
    clickFxState.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawClickParticle(particle) {
    var lifeRatio = 1 - particle.age / particle.life;
    var flicker = 0.65 + 0.35 * Math.sin(particle.age * particle.flicker + particle.phase);
    var alpha = Math.max(0, lifeRatio * flicker);

    clickFxState.ctx.save();
    clickFxState.ctx.translate(particle.x, particle.y);
    clickFxState.ctx.rotate(particle.rotation);
    clickFxState.ctx.globalAlpha = alpha;
    clickFxState.ctx.strokeStyle = particle.color;
    clickFxState.ctx.fillStyle = particle.color;
    clickFxState.ctx.lineWidth = 1.85;
    clickFxState.ctx.shadowColor = particle.color;
    clickFxState.ctx.shadowBlur = particle.glow;

    clickFxState.ctx.beginPath();
    clickFxState.ctx.moveTo(-particle.size, 0);
    clickFxState.ctx.lineTo(particle.size, 0);
    clickFxState.ctx.moveTo(0, -particle.size);
    clickFxState.ctx.lineTo(0, particle.size);
    clickFxState.ctx.stroke();

    clickFxState.ctx.beginPath();
    clickFxState.ctx.arc(0, 0, Math.max(0.85, particle.size * 0.28), 0, Math.PI * 2);
    clickFxState.ctx.fill();
    clickFxState.ctx.restore();
  }

  function stopClickParticleLoop() {
    if (clickFxState.rafId !== null) {
      window.cancelAnimationFrame(clickFxState.rafId);
      clickFxState.rafId = null;
    }
    clickFxState.lastFrameTs = 0;
  }

  function clearClickParticles() {
    clickFxState.particles.length = 0;
    if (clickFxState.ctx) {
      clickFxState.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function stepClickParticles(timestamp) {
    if (!clickFxState.ctx) {
      stopClickParticleLoop();
      return;
    }

    if (clickFxState.lastFrameTs === 0) {
      clickFxState.lastFrameTs = timestamp;
    }

    var dt = Math.min((timestamp - clickFxState.lastFrameTs) / 1000, 0.033);
    clickFxState.lastFrameTs = timestamp;
    clickFxState.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = clickFxState.particles.length - 1; i >= 0; i -= 1) {
      var particle = clickFxState.particles[i];
      particle.age += dt;

      if (particle.age >= particle.life) {
        clickFxState.particles.splice(i, 1);
        continue;
      }

      particle.vy += particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.rotation += particle.spin * dt;
      drawClickParticle(particle);
    }

    if (clickFxState.particles.length === 0) {
      stopClickParticleLoop();
      clickFxState.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }

    clickFxState.rafId = window.requestAnimationFrame(stepClickParticles);
  }

  function emitClickParticles(x, y) {
    if (!clickFxState.ctx) {
      initClickParticles();
    }

    if (!clickFxState.ctx) {
      return;
    }

    var colorSet = state.theme === 'dark' ? clickFxState.colorsDark : clickFxState.colorsLight;
    var count = 9 + Math.floor(Math.random() * 5);

    for (var i = 0; i < count; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 92 + Math.random() * 96;
      var vx = Math.cos(angle) * speed;
      var vy = Math.sin(angle) * speed;

      if (vy < -155) {
        vy = -155 + Math.random() * 22;
      }

      clickFxState.particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        gravity: 360 + Math.random() * 90,
        life: 0.58 + Math.random() * 0.28,
        age: 0,
        size: 2.6 + Math.random() * 3.0,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 6.8,
        flicker: 20 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        glow: 4 + Math.random() * 3,
        color: colorSet[Math.floor(Math.random() * colorSet.length)]
      });
    }

    if (clickFxState.rafId === null) {
      clickFxState.rafId = window.requestAnimationFrame(stepClickParticles);
    }
  }

  function initClickParticles() {
    if (clickFxState.canvas || !document.body) {
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.id = 'click-particle-layer';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    clickFxState.canvas = canvas;
    clickFxState.ctx = canvas.getContext('2d');
    resizeClickParticleCanvas();
  }

  function setActiveNav(sectionId) {
    var links = document.querySelectorAll('.nav-link[data-section]');
    links.forEach(function (link) {
      var isActive = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('is-active', isActive);
    });
  }

  function initSectionObserver() {
    if (sectionObserver) {
      sectionObserver.disconnect();
    }

    var sections = document.querySelectorAll('main .section[id]');

    sectionObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries.filter(function (entry) {
          return entry.isIntersecting;
        });

        if (visible.length === 0) {
          return;
        }

        visible.sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

        setActiveNav(visible[0].target.id);
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: [0.1, 0.25, 0.45, 0.7]
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

    setActiveNav('hero');
  }

  function initRevealObserver() {
    if (revealObserver) {
      revealObserver.disconnect();
    }

    var revealTargets = document.querySelectorAll('.reveal');

    revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08
      }
    );

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  }

  function stopAnimatedScroll() {
    if (scrollState.rafId !== null) {
      window.cancelAnimationFrame(scrollState.rafId);
      scrollState.rafId = null;
    }
  }

  function animateScrollTo(top, duration) {
    var start = window.pageYOffset || document.documentElement.scrollTop || 0;
    var distance = top - start;
    var cappedDuration = Math.max(380, Math.min(900, duration || 680));
    var startTime = 0;

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, top);
      return;
    }

    stopAnimatedScroll();

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / cappedDuration, 1);
      var eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * eased);

      if (progress < 1) {
        scrollState.rafId = window.requestAnimationFrame(step);
      } else {
        scrollState.rafId = null;
      }
    }

    scrollState.rafId = window.requestAnimationFrame(step);
  }

  function scrollToTarget(targetId) {
    var target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    var headerHeight = refs.header ? refs.header.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;

    animateScrollTo(top, 680);

    if (window.history && window.history.replaceState && /^https?:$/i.test(window.location.protocol || '')) {
      window.history.replaceState(null, '', '#' + targetId);
    }
  }

  function bindReducedMotionPreference() {
    if (!reducedMotionMedia) {
      return;
    }

    var handleMotionChange = function (event) {
      progressState.reducedMotion = event.matches;
      updateProgressBar(true);
    };

    if (typeof reducedMotionMedia.addEventListener === 'function') {
      reducedMotionMedia.addEventListener('change', handleMotionChange);
      return;
    }

    if (typeof reducedMotionMedia.addListener === 'function') {
      reducedMotionMedia.addListener(handleMotionChange);
    }
  }

  function bindGlobalEvents() {
    var markInteraction = function () {
      disableInitialScrollGuard();
      stopScrollLock();
    };

    window.addEventListener('wheel', markInteraction, { passive: true });
    window.addEventListener('touchstart', markInteraction, { passive: true });
    window.addEventListener('keydown', markInteraction);
    if (refs.menuToggle && refs.header) {
      refs.menuToggle.addEventListener('click', function () {
        var nextExpanded = refs.menuToggle.getAttribute('aria-expanded') !== 'true';
        refs.menuToggle.setAttribute('aria-expanded', String(nextExpanded));
        refs.header.classList.toggle('menu-open', nextExpanded);
      });
    }

    if (refs.langToggle) {
      refs.langToggle.addEventListener('click', function (event) {
        event.preventDefault();
        state.lang = state.lang === 'zh' ? 'en' : 'zh';
        persistLang(state.lang);
        rerenderWithScrollLock(function () {
          renderAll();
          initSectionObserver();
          initRevealObserver();
        }, {
          clearHash: true,
          lockDuration: 1200,
          afterRender: function (stableY) {
            safeFocusWithoutScroll(refs.langToggle, stableY);
          }
        });
      });
    }
    if (refs.themeToggle) {
      refs.themeToggle.addEventListener('click', function () {
        var nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
          localStorage.setItem(THEME_KEY, nextTheme);
        } catch (error) {}
        updateThemeToggleLabel();
      });
    }

    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-scroll-link]');
      if (!link) {
        return;
      }

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') {
        return;
      }

      var sectionId = href.slice(1);
      if (!sectionId) {
        return;
      }

      event.preventDefault();
      scrollToTarget(sectionId);

      if (refs.header && refs.header.classList.contains('menu-open')) {
        refs.header.classList.remove('menu-open');
      }
      if (refs.menuToggle) {
        refs.menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('pointerdown', function (event) {
      disableInitialScrollGuard();
      stopScrollLock();
      if (event.button !== 0 || event.pointerType === 'touch') {
        return;
      }
      emitClickParticles(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (initialScrollGuard.active && !initialScrollGuard.userInteracted) {
        var currentTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (currentTop > 2) {
          window.scrollTo(0, 0);
          return;
        }
      }
      updateProgressBar(false);
    }, { passive: true });
    window.addEventListener('resize', function () {
      updateProgressBar(true);
      resizeClickParticleCanvas();
      if (mapState.map) {
        mapState.map.invalidateSize();
      }
    });
    bindReducedMotionPreference();
  }

  resetInitialScrollPosition();
  startInitialScrollGuard();
  applyTheme(getInitialTheme());
  renderAll();
  hintLangToggle();
  initClickParticles();
  bindGlobalEvents();
  initSectionObserver();
  initRevealObserver();
  updateProgressBar(true);
  window.requestAnimationFrame(function () {
    window.scrollTo(0, 0);
  });
})();





























