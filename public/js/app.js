/**
 * Minehut Search Engine - Main App Logic
 */

// Shared Minecraft MOTD parser (attached to window for detail page access)
window.parseMinecraftMOTD = function(motd) {
  if (!motd) return "";
  
  let html = motd;
  
  // 1. Escape HTML first to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Convert basic markup back for color parsing
  html = html
    .replace(/&lt;color:([^&]+?)&gt;/gi, '<color:$1>')
    .replace(/&lt;\/color&gt;/gi, '</color>')
    .replace(/&lt;#([a-fA-F0-9]{6})&gt;/gi, '<#$1>')
    .replace(/&lt;\/#([a-fA-F0-9]{6})&gt;/gi, '</#$1>')
    .replace(/&lt;gradient:([^&]+?)&gt;/gi, '<gradient:$1>')
    .replace(/&lt;\/gradient&gt;/gi, '</gradient>')
    .replace(/&lt;bold&gt;/gi, '<b>')
    .replace(/&lt;\/bold&gt;/gi, '</b>')
    .replace(/&lt;italic&gt;/gi, '<i>')
    .replace(/&lt;\/italic&gt;/gi, '</i>')
    .replace(/&lt;b&gt;/gi, '<b>')
    .replace(/&lt;\/b&gt;/gi, '</b>')
    .replace(/&lt;i&gt;/gi, '<i>')
    .replace(/&lt;\/i&gt;/gi, '</i>')
    .replace(/&lt;gray&gt;/gi, '<gray>')
    .replace(/&lt;\/gray&gt;/gi, '</gray>')
    .replace(/&lt;green&gt;/gi, '<green>')
    .replace(/&lt;\/green&gt;/gi, '</green>')
    .replace(/&lt;yellow&gt;/gi, '<yellow>')
    .replace(/&lt;\/yellow&gt;/gi, '</yellow>')
    .replace(/&lt;aqua&gt;/gi, '<aqua>')
    .replace(/&lt;\/aqua&gt;/gi, '</aqua>')
    .replace(/&lt;red&gt;/gi, '<red>')
    .replace(/&lt;\/red&gt;/gi, '</red>')
    .replace(/&lt;white&gt;/gi, '<white>')
    .replace(/&lt;\/white&gt;/gi, '</white>')
    .replace(/&lt;gold&gt;/gi, '<gold>')
    .replace(/&lt;\/gold&gt;/gi, '</gold>')
    .replace(/&lt;!i&gt;/gi, '');

  // 2. Parse Gradients: <gradient:#color1:#color2>text</gradient>
  const gradientRegex = /<gradient:([^>]+?)>([\s\S]*?)<\/gradient>/gi;
  html = html.replace(gradientRegex, (match, colorsStr, text) => {
    const colors = colorsStr.split(':');
    return `<span style="background: linear-gradient(to right, ${colors.join(', ')}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; font-weight: bold;">${text}</span>`;
  });

  // 3. Parse <#RRGGBB>... </#RRGGBB> or just <#RRGGBB> (with open spans)
  const hexCloseRegex = /<#([a-fA-F0-9]{6})>([\s\S]*?)<\/#\1>/gi;
  html = html.replace(hexCloseRegex, (match, hex, text) => {
    return `<span style="color: #${hex};">${text}</span>`;
  });

  const hexOpenRegex = /<#([a-fA-F0-9]{6})>/gi;
  html = html.replace(hexOpenRegex, (match, hex) => {
    return `<span style="color: #${hex};">`;
  });

  // 4. Parse standard color tags like <color:#ff5555>...</color> or <color:#ff5555>
  const colorCloseRegex = /<color:([^>]+?)>([\s\S]*?)<\/color>/gi;
  html = html.replace(colorCloseRegex, (match, col, text) => {
    return `<span style="color: ${col};">${text}</span>`;
  });

  const colorOpenRegex = /<color:([^>]+?)>/gi;
  html = html.replace(colorOpenRegex, (match, col) => {
    return `<span style="color: ${col};">`;
  });

  // 5. Standard Minecraft color tag names
  const colorNames = {
    gray: '#aaaaaa',
    green: '#55ff55',
    yellow: '#ffff55',
    aqua: '#55ffff',
    red: '#ff5555',
    white: '#ffffff',
    gold: '#ffaa00'
  };
  Object.keys(colorNames).forEach(colorName => {
    const rgx = new RegExp(`<${colorName}>([\\s\\S]*?)</${colorName}>`, 'gi');
    html = html.replace(rgx, (match, text) => {
      return `<span style="color: ${colorNames[colorName]};">${text}</span>`;
    });
  });

  // 6. HTML styles
  html = html.replace(/<b>([\s\S]*?)<\/b>/gi, '<span class="mc-bold">$1</span>');
  html = html.replace(/<i>([\s\S]*?)<\/i>/gi, '<span class="mc-italic">$1</span>');

  // 7. Legacy ampersand color codes (&c, &l etc.)
  const legacyRegex = /&amp;([0-9a-fk-or])/gi;
  let openSpansCount = 0;
  
  html = html.replace(legacyRegex, (match, code) => {
    code = code.toLowerCase();
    
    if (code === 'r') {
      let closeSpans = '';
      while (openSpansCount > 0) {
        closeSpans += '</span>';
        openSpansCount--;
      }
      return closeSpans;
    }
    
    if (code === 'l') { openSpansCount++; return '<span class="mc-bold">'; }
    if (code === 'o') { openSpansCount++; return '<span class="mc-italic">'; }
    if (code === 'n') { openSpansCount++; return '<span class="mc-underline">'; }
    if (code === 'm') { openSpansCount++; return '<span class="mc-strike">'; }
    
    openSpansCount++;
    return `<span class="mc-color-${code}">`;
  });

  // Close any legacy open tags
  while (openSpansCount > 0) {
    html += '</span>';
    openSpansCount--;
  }

  // Convert newlines
  html = html.replace(/\n/g, '<br>');

  return html;
};

// Application State
const state = {
  servers: [],
  networkStats: {},
  homepageStats: {},
  filters: {
    query: '',
    category: 'all',
    platform: 'all',
    plan: 'all',
    sort: 'players-desc',
    onlineOnly: true
  },
  pagination: {
    currentPage: 1,
    pageSize: 10
  },
  isOfflineMode: false
};

// UI Elements
const els = {
  onlinePlayers: document.getElementById('online-players'),
  activeServers: document.getElementById('active-servers'),
  totalUsers: document.getElementById('total-users'),
  allocatedRam: document.getElementById('allocated-ram'),
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  quickTagsContainer: document.getElementById('quick-tags-container'),
  categorySelect: document.getElementById('category-select'),
  platformSelect: document.getElementById('platform-select'),
  planSelect: document.getElementById('plan-select'),
  sortSelect: document.getElementById('sort-select'),
  pageSizeSelect: document.getElementById('page-size-select'),
  onlineCheckbox: document.getElementById('online-checkbox'),
  serversGrid: document.getElementById('servers-grid'),
  resultsCountVal: document.getElementById('results-count-val'),
  paginationControls: document.getElementById('pagination-controls'),
  paginationControlsTop: document.getElementById('pagination-controls-top'),
  toast: document.getElementById('toast-notification'),
  toastTitle: document.getElementById('toast-title'),
  toastDesc: document.getElementById('toast-desc')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await loadNetworkData();
  await loadServersData();
});

// Setup Event Handlers
function setupEventListeners() {
  // Search Input with Debounce
  let searchTimeout;
  els.searchInput.addEventListener('input', (e) => {
    state.filters.query = e.target.value;
    state.pagination.currentPage = 1; // Reset to page 1 on search change
    
    // Toggle clear button
    els.searchClearBtn.style.display = e.target.value ? 'block' : 'none';

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderFilteredServers();
    }, 150);
  });

  // Clear search input
  els.searchClearBtn.addEventListener('click', () => {
    els.searchInput.value = '';
    state.filters.query = '';
    state.pagination.currentPage = 1; // Reset to page 1
    els.searchClearBtn.style.display = 'none';
    renderFilteredServers();
  });

  // Quick category tags
  els.quickTagsContainer.addEventListener('click', (e) => {
    const pill = e.target.closest('.quick-tag');
    if (!pill) return;

    // Toggle active class
    els.quickTagsContainer.querySelectorAll('.quick-tag').forEach(tag => tag.classList.remove('active'));
    pill.classList.add('active');

    // Update state and dropdown select
    const category = pill.dataset.category;
    state.filters.category = category;
    els.categorySelect.value = category;
    state.pagination.currentPage = 1; // Reset to page 1

    renderFilteredServers();
  });

  // Filter dropdown updates
  els.categorySelect.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    state.pagination.currentPage = 1; // Reset to page 1
    
    // Update active quick tag pill if exists
    els.quickTagsContainer.querySelectorAll('.quick-tag').forEach(tag => {
      if (tag.dataset.category === e.target.value) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });

    renderFilteredServers();
  });

  els.platformSelect.addEventListener('change', (e) => {
    state.filters.platform = e.target.value;
    state.pagination.currentPage = 1; // Reset to page 1
    renderFilteredServers();
  });

  els.planSelect.addEventListener('change', (e) => {
    state.filters.plan = e.target.value;
    state.pagination.currentPage = 1; // Reset to page 1
    renderFilteredServers();
  });

  els.sortSelect.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    state.pagination.currentPage = 1; // Reset to page 1
    renderFilteredServers();
  });

  els.pageSizeSelect.addEventListener('change', (e) => {
    state.pagination.pageSize = parseInt(e.target.value, 10) || 10;
    state.pagination.currentPage = 1; // Reset to page 1
    renderFilteredServers();
  });

  els.onlineCheckbox.addEventListener('change', (e) => {
    state.filters.onlineOnly = e.target.checked;
    state.pagination.currentPage = 1; // Reset to page 1
    renderFilteredServers();
  });
}

// Fetch general network statistics
async function loadNetworkData() {
  try {
    const [statsRes, homeRes] = await Promise.all([
      fetch('https://api.minehut.com/network/simple_stats'),
      fetch('https://api.minehut.com/network/homepage_stats')
    ]);

    if (!statsRes.ok || !homeRes.ok) throw new Error('API Request Failed');

    state.networkStats = await statsRes.json();
    state.homepageStats = await homeRes.json();
  } catch (err) {
    console.warn('Network stats fetch failed, falling back to mock database:', err);
    state.networkStats = window.MinehutMockData.simpleStats;
    state.homepageStats = window.MinehutMockData.homepageStats;
    activateOfflineMode();
  }

  displayNetworkStats();
}

// Render Stats Counters on top panel
function displayNetworkStats() {
  const formatNum = (num) => new Intl.NumberFormat().format(num || 0);
  
  els.onlinePlayers.textContent = formatNum(state.networkStats.player_count);
  els.activeServers.textContent = formatNum(state.networkStats.server_count);
  els.totalUsers.textContent = formatNum(state.homepageStats.user_count);
  
  // Format RAM count (returned in KB) into GB
  if (state.networkStats.ram_count) {
    const ramGb = Math.round(state.networkStats.ram_count / (1024 * 1024));
    els.allocatedRam.textContent = `${ramGb} GB`;
  } else {
    els.allocatedRam.textContent = 'N/A';
  }
}

// Fetch all online server lists
async function loadServersData() {
  try {
    // Show grid skeletons initially
    showLoadingSkeletons();

    const res = await fetch('https://api.minehut.com/servers');
    if (!res.ok) throw new Error('CORS or Server Error');

    const data = await res.json();
    state.servers = data.servers || [];
  } catch (err) {
    console.warn('Servers data fetch failed, using fallback mock servers list:', err);
    state.servers = window.MinehutMockData.servers;
    activateOfflineMode();
  }

  populateFilterDropdowns();
  renderFilteredServers();
}

// Show skeleton loading animations
function showLoadingSkeletons() {
  els.serversGrid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
}

// Dynamically populate Category, Platform, and Plan dropdowns based on API data
function populateFilterDropdowns() {
  const categories = new Set();
  const plans = new Set();

  state.servers.forEach(srv => {
    // Categories
    if (srv.allCategories && Array.isArray(srv.allCategories)) {
      srv.allCategories.forEach(cat => {
        if (cat) categories.add(cat.toLowerCase());
      });
    }

    // Get unique plans from servers data
    const plan = srv.staticInfo && srv.staticInfo.serverPlan ? srv.staticInfo.serverPlan : '';
    if (plan) {
      if (plan.toLowerCase().startsWith('custom plan') || plan.toLowerCase().includes('custom')) {
        plans.add('Custom Plan');
      } else {
        plans.add(plan);
      }
    }
  });

  // Render Categories Dropdown
  els.categorySelect.innerHTML = '<option value="all">All Categories</option>';
  Array.from(categories).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    els.categorySelect.appendChild(opt);
  });

  // Render Platforms Dropdown (Always show Java and Bedrock Edition options)
  els.platformSelect.innerHTML = `
    <option value="all">All Platforms</option>
    <option value="java">Java Edition</option>
    <option value="bedrock">Bedrock Edition</option>
  `;

  // Render Plans Dropdown (Dynamically populate from discovered plan list)
  els.planSelect.innerHTML = '<option value="all">All Plans</option>';
  Array.from(plans).sort().forEach(planName => {
    const opt = document.createElement('option');
    opt.value = planName.toLowerCase();
    opt.textContent = planName;
    els.planSelect.appendChild(opt);
  });
}

// Handle filters, sorts, pagination, and rendering
function renderFilteredServers() {
  let filtered = [...state.servers];

  // 1. Search Query Filter
  if (state.filters.query.trim()) {
    const q = state.filters.query.toLowerCase().trim();
    filtered = filtered.filter(srv => {
      const nameMatch = srv.name && srv.name.toLowerCase().includes(q);
      const authorMatch = srv.author && srv.author.toLowerCase().includes(q);
      const categoryMatch = srv.allCategories && srv.allCategories.some(c => c.toLowerCase().includes(q));
      const motdMatch = srv.motd && srv.motd.toLowerCase().includes(q);
      return nameMatch || authorMatch || categoryMatch || motdMatch;
    });
  }

  // 2. Category Dropdown / Quick Filter
  if (state.filters.category !== 'all') {
    filtered = filtered.filter(srv => 
      srv.allCategories && srv.allCategories.some(c => c.toLowerCase() === state.filters.category.toLowerCase())
    );
  }

  // 3. Platform Filter
  if (state.filters.platform !== 'all') {
    filtered = filtered.filter(srv => 
      srv.staticInfo && srv.staticInfo.platform && srv.staticInfo.platform.toLowerCase() === state.filters.platform
    );
  }

  // 4. Server Plan Filter
  if (state.filters.plan !== 'all') {
    filtered = filtered.filter(srv => {
      const plan = srv.staticInfo && srv.staticInfo.serverPlan ? srv.staticInfo.serverPlan.toLowerCase() : '';
      if (state.filters.plan === 'custom plan') {
        return plan.startsWith('custom plan') || plan.includes('custom');
      }
      return plan === state.filters.plan;
    });
  }

  // 5. Online Only Checkbox
  if (state.filters.onlineOnly) {
    filtered = filtered.filter(srv => {
      const playerCount = srv.playerData ? srv.playerData.playerCount : 0;
      const isOnline = srv.online || playerCount > 0 || (srv.staticInfo && srv.staticInfo.alwaysOnline);
      return isOnline && srv.visibility !== false;
    });
  }

  // 6. Sorting Logic
  filtered.sort((a, b) => {
    const playersA = a.playerData ? a.playerData.playerCount : 0;
    const playersB = b.playerData ? b.playerData.playerCount : 0;
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    switch (state.filters.sort) {
      case 'players-desc':
        return playersB - playersA;
      case 'players-asc':
        return playersA - playersB;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      default:
        return playersB - playersA;
    }
  });

  // Update counter
  els.resultsCountVal.textContent = filtered.length;

  // 7. Pagination Logic
  const totalItems = filtered.length;
  const pageSize = state.pagination.pageSize;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Make sure current page is in bounds
  if (state.pagination.currentPage > totalPages) {
    state.pagination.currentPage = totalPages;
  }
  if (state.pagination.currentPage < 1) {
    state.pagination.currentPage = 1;
  }

  const startIndex = (state.pagination.currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = filtered.slice(startIndex, endIndex);

  // Render to DOM
  if (pageItems.length === 0) {
    els.serversGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; border: 1px dashed var(--border-color); border-radius: var(--border-radius-lg); background: var(--bg-card);">
        <p style="font-size: 18px; font-weight: 600; color: var(--text-secondary);">No servers found matching your criteria</p>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 8px;">Try clearing filters or search terms.</p>
      </div>
    `;
    if (els.paginationControls) els.paginationControls.innerHTML = '';
    if (els.paginationControlsTop) els.paginationControlsTop.innerHTML = '';
    return;
  }

  els.serversGrid.innerHTML = '';
  pageItems.forEach(server => {
    els.serversGrid.appendChild(createServerCard(server));
  });

  // Render pagination buttons
  renderPaginationControls(totalPages);
}

// Render dynamic pagination buttons
function renderPaginationControls(totalPages) {
  const containers = [els.paginationControls, els.paginationControlsTop];
  
  containers.forEach(container => {
    if (!container) return;
    container.innerHTML = '';
    
    // If only 1 page, don't show pagination controls
    if (totalPages <= 1) {
      return;
    }
    
    const curPage = state.pagination.currentPage;
    
    // 1. Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = curPage === 1;
    prevBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      Prev
    `;
    prevBtn.addEventListener('click', () => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage--;
        renderFilteredServers();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
    container.appendChild(prevBtn);
    
    // 2. Page number buttons
    const maxPagesToShow = 5;
    let startPage = Math.max(1, curPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Ellipsis before if startPage > 1
    if (startPage > 1) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'pagination-btn';
      pageBtn.textContent = '1';
      pageBtn.addEventListener('click', () => {
        state.pagination.currentPage = 1;
        renderFilteredServers();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      });
      container.appendChild(pageBtn);
      
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.color = 'var(--text-muted)';
        ellipsis.style.padding = '0 8px';
        container.appendChild(ellipsis);
      }
    }
    
    // Individual page buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `pagination-btn ${i === curPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        state.pagination.currentPage = i;
        renderFilteredServers();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      });
      container.appendChild(pageBtn);
    }
    
    // Ellipsis after if endPage < totalPages
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.color = 'var(--text-muted)';
        ellipsis.style.padding = '0 8px';
        container.appendChild(ellipsis);
      }
      
      const pageBtn = document.createElement('button');
      pageBtn.className = 'pagination-btn';
      pageBtn.textContent = totalPages;
      pageBtn.addEventListener('click', () => {
        state.pagination.currentPage = totalPages;
        renderFilteredServers();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      });
      container.appendChild(pageBtn);
    }
    
    // 3. Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = curPage === totalPages;
    nextBtn.innerHTML = `
      Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    `;
    nextBtn.addEventListener('click', () => {
      if (state.pagination.currentPage < totalPages) {
        state.pagination.currentPage++;
        renderFilteredServers();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
    container.appendChild(nextBtn);
  });
}

// Create Card Elements dynamically
function createServerCard(server) {
  const card = document.createElement('div');
  card.className = 'server-card';
  card.dataset.name = server.name;

  // Render Icon
  let iconHtml = '';
  if (server.server_list_favicon) {
    iconHtml = `<img src="${server.server_list_favicon}" alt="Favicon" style="width: 100%; height: 100%; object-fit: contain; border-radius: var(--border-radius-sm); padding: 4px;" />`;
  } else if (server.icon) {
    // Show standard icon mapping or character initial
    const formattedIcon = server.icon.replace(/_/g, ' ');
    // Get emoji/symbol or just initial depending on what minecraft item it is
    const emojiMap = {
      'END_CRYSTAL': '💎',
      'GOLDEN_APPLE': '🍎',
      'DIAMOND': '💎',
      'CAMPFIRE': '🔥',
      'ELYTRA': '🕊️',
      'BEACON': '🌟',
      'IRON_SWORD': '⚔️',
      'NETHER_STAR': '⭐'
    };
    const emoji = emojiMap[server.icon] || '🎮';
    iconHtml = `<span title="${formattedIcon}">${emoji}</span>`;
  } else {
    // Initial letter
    const initial = server.name ? server.name.charAt(0) : 'S';
    iconHtml = `<span class="server-icon-character">${initial}</span>`;
  }

  // Server Plan Badge
  const plan = server.staticInfo && server.staticInfo.serverPlan ? server.staticInfo.serverPlan.toLowerCase() : 'free';
  let planBadgeClass = 'badge-plan-free';
  let planLabel = 'FREE';

  if (plan.includes('pro')) {
    planBadgeClass = 'badge-plan-pro';
    planLabel = 'PRO';
  } else if (plan.includes('ultra')) {
    planBadgeClass = 'badge-plan-ultra';
    planLabel = 'ULTRA';
  } else if (plan.includes('external')) {
    planBadgeClass = 'badge-plan-external';
    planLabel = 'EXTERNAL';
  } else if (plan.startsWith('custom plan') || plan.includes('custom')) {
    planBadgeClass = 'badge-plan-custom';
    planLabel = 'CUSTOM';
  }

  // Owner username
  const ownerName = server.author || 'Unknown';

  // Author Rank Badge (optional)
  let rankBadgeHtml = '';
  if (server.authorRank && server.authorRank !== 'DEFAULT') {
    const rank = server.authorRank.toUpperCase();
    let rankClass = 'badge-rank-vip';
    if (rank.includes('ADMIN')) rankClass = 'badge-rank-admin';
    if (rank.includes('DEV')) rankClass = 'badge-rank-dev';
    if (rank.includes('PRO')) rankClass = 'badge-rank-pro';
    rankBadgeHtml = `<span class="badge ${rankClass}">${rank}</span>`;
  }

  // Platform
  const platform = server.staticInfo && server.staticInfo.platform ? server.staticInfo.platform.toUpperCase() : 'JAVA';

  // MOTD Formatting
  const motdParsed = window.parseMinecraftMOTD(server.motd || 'A Minehut Server.');

  // Categories Pill List
  let categoriesHtml = '';
  if (server.allCategories && Array.isArray(server.allCategories)) {
    categoriesHtml = server.allCategories.slice(0, 3).map(cat => 
      `<span class="category-pill">${cat.toLowerCase()}</span>`
    ).join('');
  }

  // Players data
  const playerCount = server.playerData ? server.playerData.playerCount : 0;
  const maxPlayers = server.maxPlayers || 10;
  const progressPercent = maxPlayers > 0 ? Math.min((playerCount / maxPlayers) * 100, 100) : 0;
  const isOnline = server.online || playerCount > 0 || (server.staticInfo && server.staticInfo.alwaysOnline);

  card.innerHTML = `
    <div>
      <div class="card-header">
        <div class="server-icon">${iconHtml}</div>
        <div class="server-title-area">
          <div class="server-name">${server.name || 'Minehut Server'}</div>
          <div class="server-owner">by <span class="owner-name">${ownerName}</span> ${rankBadgeHtml}</div>
          <div class="server-meta">
            <span class="badge ${planBadgeClass}">${planLabel}</span>
            <span class="platform-tag">${platform}</span>
          </div>
        </div>
      </div>
      <div class="card-motd">${motdParsed}</div>
      <div class="card-categories">${categoriesHtml}</div>
    </div>

    <div class="card-footer">
      <div class="player-count-display">
        <div class="player-numbers">
          <span class="player-label">Players</span>
          <span class="player-digits">${playerCount} / ${maxPlayers}</span>
        </div>
        <div class="player-bar-track">
          <div class="player-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
      
      <div class="server-status">
        <span class="status-dot ${isOnline ? 'online' : ''}"></span>
        <span class="status-text ${isOnline ? 'online' : ''}">${isOnline ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  `;

  // Click handler to open details view
  card.addEventListener('click', () => {
    const query = new URLSearchParams({
      name: server.name,
      owner: ownerName,
      rank: server.authorRank || 'DEFAULT'
    });
    window.location.href = `detail/index.html?${query.toString()}`;
  });

  return card;
}

// Toggle Toast Alert for CORS/Fallback Offline mode active
function activateOfflineMode() {
  if (state.isOfflineMode) return;
  state.isOfflineMode = true;

  els.toastTitle.textContent = "Offline Mode / CORS Fallback";
  els.toastDesc.textContent = "Minehut API requests were blocked by CORS. Loaded high-quality mock data instead.";
  els.toast.classList.add('show');

  // Slide away after 5 seconds
  setTimeout(() => {
    els.toast.classList.remove('show');
  }, 6000);
}
