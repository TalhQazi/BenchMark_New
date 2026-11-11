/**
 * Benchmark Justice™ — Modern Web Application
 * Matches Mobile App Features, Interactions & Theme System
 */

import {
  COVERAGE_STATS,
  TREND_DATA,
  LIVE_FEED_ITEMS,
  JUDGES_DATA,
  COURTS_DATA,
  CASES_DATA,
  ATTORNEYS_DATA,
  LEGISLATORS_DATA,
} from './data.js';

/* --------------------------------------------------------------------------
   1. Theme Management (Modern Web Guidance Compliant)
   -------------------------------------------------------------------------- */
class ThemeManager {
  constructor() {
    this.meta = document.querySelector('meta[name="color-scheme"]');
    this.toggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-toggle-icon');
    
    this.init();
  }

  init() {
    // Sync UI with current theme on load
    this.updateToggleIcon();

    // Toggle button click listener
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    // React to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem('color-scheme')) {
        this.updateToggleIcon();
      }
    });

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'color-scheme') {
        const scheme = e.newValue || 'light dark';
        if (this.meta) this.meta.content = scheme;
        document.documentElement.setAttribute('data-theme', scheme === 'dark' ? 'dark' : scheme === 'light' ? 'light' : '');
        this.updateToggleIcon();
      }
    });
  }

  isDark() {
    const metaContent = this.meta ? this.meta.content : 'light dark';
    if (metaContent === 'dark') return true;
    if (metaContent === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggle() {
    const currentlyDark = this.isDark();
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const targetScheme = currentlyDark ? 'light' : 'dark';

    // If target equals system default, revert override (undo pinning)
    if ((targetScheme === 'dark' && systemPrefersDark) || (targetScheme === 'light' && !systemPrefersDark)) {
      localStorage.removeItem('color-scheme');
      if (this.meta) this.meta.content = 'light dark';
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem('color-scheme', targetScheme);
      if (this.meta) this.meta.content = targetScheme;
      document.documentElement.setAttribute('data-theme', targetScheme);
    }

    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const dark = this.isDark();
    if (this.themeIcon) {
      this.themeIcon.innerHTML = dark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      this.toggleBtn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Bookmarks & Research Dossier Storage
   -------------------------------------------------------------------------- */
class DossierStore {
  constructor() {
    this.key = 'bmj_saved_research';
  }

  getSaved() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || { cases: [], judges: [] };
    } catch {
      return { cases: [], judges: [] };
    }
  }

  isSaved(type, id) {
    const data = this.getSaved();
    return Array.isArray(data[type]) && data[type].includes(id);
  }

  toggle(type, id) {
    const data = this.getSaved();
    if (!data[type]) data[type] = [];
    const idx = data[type].indexOf(id);
    if (idx >= 0) {
      data[type].splice(idx, 1);
    } else {
      data[type].push(id);
    }
    localStorage.setItem(this.key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('dossier-updated'));
    return idx < 0; // returns true if now saved
  }
}

const dossier = new DossierStore();

/* --------------------------------------------------------------------------
   3. Main App Controller & Router
   -------------------------------------------------------------------------- */
class BenchmarkApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.currentView = 'dashboard';
    this.searchFilter = 'all';
    this.searchQuery = '';
    
    this.initElements();
    this.initRouter();
    this.initGreeting();
    this.initCounters();
    this.initTrendGraph();
    this.initLiveFeed();
    this.initCategoryCards();
    this.initSearch();
    this.initCourts();
    this.initKeyboardShortcuts();
  }

  initElements() {
    this.views = {
      dashboard: document.getElementById('view-dashboard'),
      search: document.getElementById('view-search'),
      courts: document.getElementById('view-courts'),
      activity: document.getElementById('view-activity'),
      bookmarks: document.getElementById('view-bookmarks'),
    };

    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.modalOverlay = document.getElementById('detail-modal-overlay');
    this.modalContent = document.getElementById('modal-dynamic-content');
    this.modalCloseBtn = document.getElementById('modal-close-button');

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }

    // Mobile nav drawer
    this.mobileToggle = document.getElementById('mobile-nav-btn');
    this.mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (this.mobileToggle && this.mobileDrawer) {
      this.mobileToggle.addEventListener('click', () => {
        this.mobileDrawer.classList.toggle('open');
      });
    }

    // Dossier badge
    window.addEventListener('dossier-updated', () => this.updateDossierBadge());
    this.updateDossierBadge();
  }

  updateDossierBadge() {
    const saved = dossier.getSaved();
    const count = (saved.cases?.length || 0) + (saved.judges?.length || 0);
    const badge = document.getElementById('saved-count-badge');
    if (badge) {
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  /* ------------------------------------------------------------------------
     Router & Navigation
     ------------------------------------------------------------------------ */
  initRouter() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();

    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          if (this.mobileDrawer) this.mobileDrawer.classList.remove('open');
        }
      });
    });
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const [route, param] = hash.split(':');

    if (route === 'case' && param) {
      this.switchView('dashboard');
      this.openCaseModal(param);
      return;
    }
    if (route === 'judge' && param) {
      this.switchView('dashboard');
      this.openJudgeModal(param);
      return;
    }
    if (route === 'category' && param) {
      this.switchView('search');
      this.setSearchFilter(param);
      return;
    }

    this.switchView(route);
  }

  switchView(viewName) {
    if (!this.views[viewName]) viewName = 'dashboard';
    this.currentView = viewName;

    Object.entries(this.views).forEach(([name, el]) => {
      if (el) {
        if (name === viewName) {
          el.classList.add('active-view');
        } else {
          el.classList.remove('active-view');
        }
      }
    });

    this.navLinks.forEach((link) => {
      const target = link.getAttribute('data-view');
      if (target === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'bookmarks') {
      this.renderBookmarksView();
    }
  }

  initGreeting() {
    const h = new Date().getHours();
    let text = 'Good evening';
    if (h < 12) text = 'Good morning';
    else if (h < 18) text = 'Good afternoon';
    const el = document.getElementById('hero-greeting-text');
    if (el) el.textContent = `${text} · Judicial Research`;
  }

  /* ------------------------------------------------------------------------
     Live Counters with Animation
     ------------------------------------------------------------------------ */
  initCounters() {
    const grid = document.getElementById('coverage-counters-container');
    if (!grid) return;

    const stats = [
      { label: 'Published opinions', value: COVERAGE_STATS.opinions, tone: 'tone-gold', icon: 'file-text' },
      { label: 'Federal dockets (approx.)', value: COVERAGE_STATS.dockets, tone: 'tone-teal', icon: 'folder' },
      { label: 'Judges indexed', value: COVERAGE_STATS.judges, tone: 'tone-success', icon: 'gavel' },
      { label: 'Active courts', value: COVERAGE_STATS.courts, tone: 'tone-warning', icon: 'landmark' },
      { label: 'Attorneys on record', value: COVERAGE_STATS.attorneys, tone: 'tone-info', icon: 'briefcase' },
      { label: 'Members of Congress', value: COVERAGE_STATS.legislators, tone: 'tone-plum', icon: 'vote' },
    ];

    const iconSvgs = {
      'file-text': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
      folder: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
      gavel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`,
      landmark: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="6" y2="18"/><line x1="6" x2="6" y1="10" y2="18"/><line x1="18" x2="18" y1="10" y2="18"/><path d="m3 6 9-4 9 4"/></svg>`,
      briefcase: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
      vote: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>`,
    };

    grid.innerHTML = stats
      .map(
        (s) => `
      <div class="counter-stat-card">
        <div class="counter-icon-tile ${s.tone}">
          ${iconSvgs[s.icon] || ''}
        </div>
        <div class="counter-stat-value">${s.value}</div>
        <div class="counter-stat-label">${s.label}</div>
      </div>
    `
      )
      .join('');
  }

  /* ------------------------------------------------------------------------
     Trend Graph / Interactive SVG Chart
     ------------------------------------------------------------------------ */
  initTrendGraph() {
    const container = document.getElementById('trend-chart-container');
    if (!container) return;

    const width = 500;
    const height = 180;
    const padX = 24;
    const padTop = 20;
    const padBottom = 34;
    const graphH = height - padTop - padBottom;
    const max = Math.max(...TREND_DATA.map((p) => p.value));
    const step = (width - padX * 2) / (TREND_DATA.length - 1);

    const coords = TREND_DATA.map((p, i) => ({
      ...p,
      x: padX + i * step,
      y: padTop + (1 - p.value / max) * graphH,
    }));

    const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
    const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padBottom} L ${coords[0].x.toFixed(1)} ${height - padBottom} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <defs>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C2A15A" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="#C2A15A" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Horizontal grid line -->
        <line x1="${padX}" y1="${padTop + graphH / 2}" x2="${width - padX}" y2="${padTop + graphH / 2}" stroke="var(--divider)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height - padBottom}" x2="${width - padX}" y2="${height - padBottom}" stroke="var(--border)"/>
        
        <!-- Fill Area -->
        <path d="${areaD}" fill="url(#gold-grad)"/>
        <!-- Line Path -->
        <path d="${pathD}" fill="none" stroke="var(--gold-400)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        
        <!-- Data Dots & X-Labels -->
        ${coords
          .map(
            (c, i) => `
          <circle cx="${c.x}" cy="${c.y}" r="4" fill="var(--surface)" stroke="var(--gold-400)" stroke-width="2.2" class="chart-point-dot" data-idx="${i}" style="cursor: pointer;"/>
          <text x="${c.x}" y="${height - 12}" text-anchor="middle" font-size="10" fill="var(--text-tertiary)" font-family="var(--font-mono)">${c.year}</text>
        `
          )
          .join('')}
      </svg>
      <div id="chart-tooltip" style="position: absolute; display: none; padding: 6px 12px; background: var(--navy-900); color: var(--parchment); border: 1px solid var(--accent-border); border-radius: var(--radius-xs); font-size: 0.75rem; pointer-events: none; z-index: 10; box-shadow: var(--shadow-md);"></div>
    `;

    // Tooltip interactivity
    const dots = container.querySelectorAll('.chart-point-dot');
    const tooltip = container.querySelector('#chart-tooltip');

    dots.forEach((dot) => {
      dot.addEventListener('mouseenter', (e) => {
        const idx = Number(dot.getAttribute('data-idx'));
        const item = TREND_DATA[idx];
        if (tooltip && item) {
          tooltip.innerHTML = `<strong>${item.year}</strong>: ${item.value.toLocaleString()} records filed`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${dot.cx.baseVal.value - 40}px`;
          tooltip.style.top = `${dot.cy.baseVal.value - 36}px`;
        }
      });
      dot.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  /* ------------------------------------------------------------------------
     Live Intelligence Feed
     ------------------------------------------------------------------------ */
  initLiveFeed() {
    const container = document.getElementById('live-feed-container');
    if (!container) return;

    container.innerHTML = LIVE_FEED_ITEMS.map(
      (item) => `
      <article class="feed-item-card" data-route-id="${item.routeId}">
        <div class="feed-item-meta-top">
          <span class="feed-item-tag ${item.kind === 'opinion' ? 'tone-gold' : 'tone-teal'}">${item.tag}</span>
          <span class="feed-item-time">${item.timeAgo}</span>
        </div>
        <div class="feed-item-main">
          <div>
            <h4 class="feed-item-title">${item.title}</h4>
            <div class="feed-item-court">${item.court}</div>
          </div>
        </div>
        ${
          item.detail
            ? `
          <div class="feed-item-quote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
            <span>${item.detail}</span>
          </div>
        `
            : ''
        }
      </article>
    `
    ).join('');

    container.querySelectorAll('.feed-item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const routeId = card.getAttribute('data-route-id');
        if (routeId) {
          const [kind, id] = routeId.split(':');
          if (kind === 'cluster') this.openCaseModal(`cluster:${id}`);
          else if (kind === 'docket') this.openCaseModal(`docket:${id}`);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Browse by Category Cards
     ------------------------------------------------------------------------ */
  initCategoryCards() {
    const cards = document.querySelectorAll('.entity-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        if (cat === 'courts') {
          window.location.hash = '#courts';
        } else {
          window.location.hash = `#category:${cat}`;
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Universal Search Engine
     ------------------------------------------------------------------------ */
  initSearch() {
    this.heroSearchInput = document.getElementById('hero-search-input');
    this.heroSearchBtn = document.getElementById('hero-search-btn');
    this.mainSearchInput = document.getElementById('main-search-input');
    this.filterPills = document.querySelectorAll('.filter-pill');
    this.searchResultsContainer = document.getElementById('search-results-container');
    this.resultsCountLabel = document.getElementById('search-results-count');

    // Hero search triggers navigation to #search
    if (this.heroSearchBtn && this.heroSearchInput) {
      const execHeroSearch = () => {
        const q = this.heroSearchInput.value.trim();
        window.location.hash = '#search';
        if (this.mainSearchInput) this.mainSearchInput.value = q;
        this.performSearch(q);
      };

      this.heroSearchBtn.addEventListener('click', execHeroSearch);
      this.heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') execHeroSearch();
      });
    }

    // Quick chips in hero
    document.querySelectorAll('.quick-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^"|"$/g, '');
        window.location.hash = '#search';
        if (this.mainSearchInput) this.mainSearchInput.value = text;
        this.performSearch(text);
      });
    });

    // Main search input
    if (this.mainSearchInput) {
      let timeout = null;
      this.mainSearchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.performSearch(this.mainSearchInput.value.trim());
        }, 220);
      });
    }

    // Filter pills
    this.filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.setSearchFilter(pill.getAttribute('data-filter'));
      });
    });

    // Initial default search
    this.performSearch('');
  }

  setSearchFilter(filterName) {
    this.searchFilter = filterName || 'all';
    this.filterPills.forEach((p) => {
      if (p.getAttribute('data-filter') === this.searchFilter) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    const q = this.mainSearchInput ? this.mainSearchInput.value.trim() : '';
    this.performSearch(q);
  }

  performSearch(query) {
    this.searchQuery = (query || '').toLowerCase();
    const results = [];

    // Filter Judges
    if (this.searchFilter === 'all' || this.searchFilter === 'judges') {
      JUDGES_DATA.forEach((j) => {
        if (!this.searchQuery || j.name.toLowerCase().includes(this.searchQuery) || j.court.toLowerCase().includes(this.searchQuery)) {
          results.push({
            type: 'judge',
            id: j.id,
            title: j.name,
            subtitle: `${j.title} · ${j.court}`,
            tag: j.nominatedBy ? `Nominated by ${j.nominatedBy}` : 'Judge',
            tone: 'tone-gold',
            item: j,
          });
        }
      });
    }

    // Filter Cases
    if (this.searchFilter === 'all' || this.searchFilter === 'cases') {
      CASES_DATA.forEach((c) => {
        if (!this.searchQuery || c.title.toLowerCase().includes(this.searchQuery) || c.court.toLowerCase().includes(this.searchQuery) || c.docketNumber.toLowerCase().includes(this.searchQuery)) {
          results.push({
            type: 'case',
            id: c.id,
            title: c.title,
            subtitle: `${c.docketNumber} · ${c.court} (${c.date})`,
            tag: `${c.citeCount} citations · ${c.status.split('·')[0].trim()}`,
            tone: 'tone-teal',
            item: c,
          });
        }
      });
    }

    // Filter Attorneys
    if (this.searchFilter === 'all' || this.searchFilter === 'attorneys') {
      ATTORNEYS_DATA.forEach((a) => {
        if (!this.searchQuery || a.name.toLowerCase().includes(this.searchQuery) || a.firm.toLowerCase().includes(this.searchQuery)) {
          results.push({
            type: 'attorney',
            id: a.id,
            title: a.name,
            subtitle: `${a.role} · ${a.firm}`,
            tag: `${a.appearances} appearances`,
            tone: 'tone-info',
            item: a,
          });
        }
      });
    }

    // Filter Legislators
    if (this.searchFilter === 'all' || this.searchFilter === 'legislators') {
      LEGISLATORS_DATA.forEach((l) => {
        if (!this.searchQuery || l.name.toLowerCase().includes(this.searchQuery) || l.state.toLowerCase().includes(this.searchQuery)) {
          results.push({
            type: 'legislator',
            id: l.id,
            title: l.name,
            subtitle: `${l.role} (${l.party}-${l.state}) · ${l.committee}`,
            tag: `${l.sponsoredBills} sponsored bills`,
            tone: 'tone-plum',
            item: l,
          });
        }
      });
    }

    this.renderSearchResults(results);
  }

  renderSearchResults(results) {
    if (!this.searchResultsContainer) return;

    if (this.resultsCountLabel) {
      this.resultsCountLabel.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
    }

    if (results.length === 0) {
      this.searchResultsContainer.innerHTML = `
        <div style="padding: 64px 20px; text-align: center; color: var(--text-tertiary);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text);">No records found</h3>
          <p style="margin-top: 6px; font-size: 0.9rem;">Try adjusting your query or selecting "All" categories.</p>
        </div>
      `;
      return;
    }

    this.searchResultsContainer.innerHTML = results
      .map(
        (r) => `
      <div class="result-card-row" data-type="${r.type}" data-id="${r.id}">
        <div class="result-info-group">
          <div>
            <h4 class="result-title">${r.title}</h4>
            <div class="result-subtitle">${r.subtitle}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
          <span class="badge ${r.tone}">${r.tag}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    `
      )
      .join('');

    this.searchResultsContainer.querySelectorAll('.result-card-row').forEach((row) => {
      row.addEventListener('click', () => {
        const type = row.getAttribute('data-type');
        const id = row.getAttribute('data-id');
        if (type === 'case') this.openCaseModal(id);
        else if (type === 'judge') this.openJudgeModal(id);
        else if (type === 'attorney') this.openAttorneyModal(id);
        else if (type === 'legislator') this.openLegislatorModal(id);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Courts Directory
     ------------------------------------------------------------------------ */
  initCourts() {
    const container = document.getElementById('courts-grid-container');
    if (!container) return;

    container.innerHTML = COURTS_DATA.map(
      (c) => `
      <div class="court-card" data-court-id="${c.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="court-code-pill">${c.shortName}</span>
          <span class="badge tone-warning">${c.jurisdiction}</span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text);">${c.fullName}</h4>
        <div style="display: flex; gap: 16px; margin-top: 14px; font-size: 0.82rem; color: var(--text-tertiary); border-top: 1px solid var(--divider); padding-top: 10px;">
          <span>Citation: <strong>${c.citation}</strong></span>
          <span>Active Judges: <strong>${c.activeJudges}</strong></span>
          <span>Dockets: <strong>${c.totalCases}</strong></span>
        </div>
      </div>
    `
    ).join('');

    container.querySelectorAll('.court-card').forEach((card) => {
      card.addEventListener('click', () => {
        const courtId = card.getAttribute('data-court-id');
        const court = COURTS_DATA.find((c) => c.id === courtId);
        if (court) this.openCourtModal(court);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Detail Modals (Judge, Case, Court, Dossier)
     ------------------------------------------------------------------------ */
  openModal(html) {
    if (this.modalContent && this.modalOverlay) {
      this.modalContent.innerHTML = html;
      this.modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openJudgeModal(id) {
    const judge = JUDGES_DATA.find((j) => j.id === id) || JUDGES_DATA[0];
    const isSaved = dossier.isSaved('judges', judge.id);

    const html = `
      <div class="modal-header-hero">
        <div class="profile-modal-avatar">
          ${judge.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <span class="badge tone-gold">${judge.status} · ${judge.jurisdiction}</span>
        <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-top: 8px; color: var(--parchment);">${judge.name}</h2>
        <div style="color: var(--gold-300); font-size: 1rem; margin-top: 4px;">${judge.title}</div>
        <div style="color: var(--navy-300); font-size: 0.9rem;">${judge.court}</div>

        <div style="margin-top: 18px; display: flex; gap: 10px;">
          <button id="save-judge-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            ${isSaved ? '★ Saved to Dossier' : '☆ Bookmark Judge'}
          </button>
        </div>
      </div>

      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Authored Opinions</div>
            <div class="stat-pill-val">${judge.authoredOpinions}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Tenure</div>
            <div class="stat-pill-val">${judge.yearsOfService}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Nominated By</div>
            <div class="stat-pill-val" style="font-size: 1rem;">${judge.nominatedBy}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Confirmed</div>
            <div class="stat-pill-val" style="font-size: 0.95rem;">${judge.confirmationDate}</div>
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Biography & Background</h4>
          <p style="margin-top: 8px; line-height: 1.6; color: var(--text-secondary);">${judge.biography}</p>
        </div>

        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Education</h4>
          <p style="margin-top: 6px; color: var(--text);">${judge.education}</p>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Precedential Opinions</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            ${judge.notableCases
              .map(
                (c) => `
              <div style="padding: 12px 14px; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-family: var(--font-serif); font-weight: 700; color: var(--text);">${c.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-tertiary);">${c.year}</div>
                </div>
                <span class="badge tone-teal">${c.cites} citations</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    this.openModal(html);

    document.getElementById('save-judge-btn')?.addEventListener('click', () => {
      const savedNow = dossier.toggle('judges', judge.id);
      const btn = document.getElementById('save-judge-btn');
      if (btn) btn.textContent = savedNow ? '★ Saved to Dossier' : '☆ Bookmark Judge';
    });
  }

  openCaseModal(id) {
    const caseItem = CASES_DATA.find((c) => c.id === id) || CASES_DATA[0];
    const isSaved = dossier.isSaved('cases', caseItem.id);

    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-teal">${caseItem.status}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment); line-height: 1.25;">${caseItem.title}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 6px;">${caseItem.court} · ${caseItem.docketNumber}</div>
        <div style="color: var(--navy-300); font-size: 0.85rem;">Date Filed: ${caseItem.date} · Citing references: ${caseItem.citeCount}</div>

        <div style="margin-top: 18px; display: flex; gap: 10px;">
          <button id="save-case-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            ${isSaved ? '★ Saved to Dossier' : '☆ Bookmark Case'}
          </button>
          <button id="copy-citation-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            Copy Citation
          </button>
        </div>
      </div>

      <div class="modal-body-padding">
        <div style="padding: 16px; background: var(--surface-sunken); border-left: 3px solid var(--accent); border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.55; color: var(--text);">
          <strong>Summary:</strong> ${caseItem.summary}
        </div>

        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Counsel of Record</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${caseItem.counsel
              .map(
                (co) => `
              <div style="font-size: 0.9rem; color: var(--text);">
                <strong>${co.name}</strong> — <span style="color: var(--text-secondary);">${co.role}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Full Opinion Text</h4>
          <div style="margin-top: 10px; padding: 20px; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-lg); font-family: var(--font-serif); font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap; max-height: 380px; overflow-y: auto; color: var(--text);">
${caseItem.fullText}
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Docket Proceedings & Filings</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            ${caseItem.docketEntries
              .map(
                (d) => `
              <div style="padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.85rem;">
                <span style="font-family: var(--font-mono); color: var(--accent); font-weight: 600;">${d.date}</span>: ${d.text}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    this.openModal(html);

    document.getElementById('save-case-btn')?.addEventListener('click', () => {
      const savedNow = dossier.toggle('cases', caseItem.id);
      const btn = document.getElementById('save-case-btn');
      if (btn) btn.textContent = savedNow ? '★ Saved to Dossier' : '☆ Bookmark Case';
    });

    document.getElementById('copy-citation-btn')?.addEventListener('click', () => {
      const cit = caseItem.citations ? caseItem.citations[0] : caseItem.docketNumber;
      navigator.clipboard.writeText(`${caseItem.title}, ${cit} (${caseItem.date.split('-')[0]})`);
      const btn = document.getElementById('copy-citation-btn');
      if (btn) btn.textContent = 'Citation Copied!';
      setTimeout(() => {
        if (btn) btn.textContent = 'Copy Citation';
      }, 2000);
    });
  }

  openAttorneyModal(id) {
    const at = ATTORNEYS_DATA.find((a) => a.id === id) || ATTORNEYS_DATA[0];
    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-info">${at.role}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment);">${at.name}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">${at.firm}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Federal Appearances</div>
            <div class="stat-pill-val">${at.appearances}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Admitted Jurisdictions</h4>
          <ul style="margin-top: 8px; padding-left: 20px; color: var(--text-secondary); line-height: 1.6;">
            ${at.jurisdictions.map((j) => `<li>${j}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <h4 class="section-eyebrow">Notable Matters</h4>
          <p style="margin-top: 6px; color: var(--text);">${at.notableMatters}</p>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  openLegislatorModal(id) {
    const leg = LEGISLATORS_DATA.find((l) => l.id === id) || LEGISLATORS_DATA[0];
    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-plum">${leg.party} · ${leg.state}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment);">${leg.name}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">${leg.role}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Sponsored Legislation</div>
            <div class="stat-pill-val">${leg.sponsoredBills}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Committee Assignments</h4>
          <p style="margin-top: 6px; font-weight: 600; color: var(--text);">${leg.committee}</p>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  openCourtModal(court) {
    const html = `
      <div class="modal-header-hero">
        <span class="court-code-pill" style="margin-bottom: 8px;">${court.shortName}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 8px; color: var(--parchment);">${court.fullName}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">Jurisdiction: ${court.jurisdiction} · Citation: ${court.citation}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Active Judges</div>
            <div class="stat-pill-val">${court.activeJudges}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Archived Dockets</div>
            <div class="stat-pill-val">${court.totalCases}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <button class="search-action-btn" style="width: 100%; justify-content: center;" onclick="window.location.hash='#search'; benchmarkApp.mainSearchInput.value='${court.shortName}'; benchmarkApp.performSearch('${court.shortName}'); benchmarkApp.closeModal();">
            Search All Cases in ${court.shortName}
          </button>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  renderBookmarksView() {
    const container = document.getElementById('bookmarks-list-container');
    if (!container) return;

    const saved = dossier.getSaved();
    const savedCases = CASES_DATA.filter((c) => saved.cases.includes(c.id));
    const savedJudges = JUDGES_DATA.filter((j) => saved.judges.includes(j.id));

    if (savedCases.length === 0 && savedJudges.length === 0) {
      container.innerHTML = `
        <div style="padding: 48px 20px; text-align: center; color: var(--text-tertiary);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px;"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text);">No saved records yet</h3>
          <p style="margin-top: 6px; font-size: 0.9rem;">Click "Bookmark" on any case or judge profile to add it to your research dossier.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${savedCases
          .map(
            (c) => `
          <div class="result-card-row" onclick="benchmarkApp.openCaseModal('${c.id}')">
            <div>
              <span class="badge tone-teal">Case Law</span>
              <h4 class="result-title" style="margin-top: 6px;">${c.title}</h4>
              <div class="result-subtitle">${c.court} · ${c.docketNumber}</div>
            </div>
            <button class="quick-chip" onclick="event.stopPropagation(); dossier.toggle('cases', '${c.id}'); benchmarkApp.renderBookmarksView();">Remove</button>
          </div>
        `
          )
          .join('')}
        ${savedJudges
          .map(
            (j) => `
          <div class="result-card-row" onclick="benchmarkApp.openJudgeModal('${j.id}')">
            <div>
              <span class="badge tone-gold">Judge</span>
              <h4 class="result-title" style="margin-top: 6px;">${j.name}</h4>
              <div class="result-subtitle">${j.title} · ${j.court}</div>
            </div>
            <button class="quick-chip" onclick="event.stopPropagation(); dossier.toggle('judges', '${j.id}'); benchmarkApp.renderBookmarksView();">Remove</button>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     Keyboard Shortcuts
     ------------------------------------------------------------------------ */
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Escape closes modal
      if (e.key === 'Escape') {
        this.closeModal();
      }
      // '/' or Cmd+K focuses search
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        window.location.hash = '#search';
        setTimeout(() => {
          if (this.mainSearchInput) this.mainSearchInput.focus();
        }, 100);
      }
    });
  }
}

// Instantiate and expose globally for inline event handlers
window.benchmarkApp = new BenchmarkApp();
window.dossier = dossier;

