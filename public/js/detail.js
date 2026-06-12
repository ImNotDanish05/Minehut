/**
 * Minehut Search Engine - Server Details Page Logic
 */

// Local copy of Minecraft MOTD parser to keep detail page self-contained
function parseMinecraftMOTD(motd) {
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

  // 3. Parse <#RRGGBB>... </#RRGGBB> or just <#RRGGBB>
  const hexCloseRegex = /<#([a-fA-F0-9]{6})>([\s\S]*?)<\/#\1>/gi;
  html = html.replace(hexCloseRegex, (match, hex, text) => {
    return `<span style="color: #${hex};">${text}</span>`;
  });

  const hexOpenRegex = /<#([a-fA-F0-9]{6})>/gi;
  html = html.replace(hexOpenRegex, (match, hex) => {
    return `<span style="color: #${hex};">`;
  });

  // 4. Parse standard color tags like <color:#ff5555>...</color>
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
}

// UI Elements
const els = {
  banner: document.getElementById('server-banner'),
  serverIcon: document.getElementById('server-icon'),
  serverName: document.getElementById('server-name'),
  detailServerOwner: document.getElementById('detail-server-owner'),
  metaTags: document.getElementById('server-meta-tags'),
  serverIp: document.getElementById('server-ip'),
  btnCopyIp: document.getElementById('btn-copy-ip'),
  copyText: document.getElementById('copy-text'),
  copyIcon: document.getElementById('copy-icon'),
  serverMotd: document.getElementById('server-motd'),
  
  // Dashboard stats
  statUptime: document.getElementById('stat-uptime'),
  statSlots: document.getElementById('stat-slots'),
  statPlan: document.getElementById('stat-plan'),
  statCredits: document.getElementById('stat-credits'),
  statVersion: document.getElementById('stat-version'),
  statCreated: document.getElementById('stat-created'),
  statJoins: document.getElementById('stat-joins'),
  statDailyUptime: document.getElementById('stat-daily-uptime'),
  statOwner: document.getElementById('stat-owner'),
  statOwnerId: document.getElementById('stat-owner-id'),
  
  categoriesList: document.getElementById('detail-categories'),
  pluginsSection: document.getElementById('plugins-section'),
  pluginsList: document.getElementById('plugins-list'),
  toast: document.getElementById('toast-notification'),
  toastTitle: document.getElementById('toast-title'),
  toastDesc: document.getElementById('toast-desc'),
  
  // Plan specs elements
  planSpecBadge: document.getElementById('plan-spec-badge'),
  planSpecCost: document.getElementById('plan-spec-cost'),
  planSpecPlayers: document.getElementById('plan-spec-players'),
  planSpecRam: document.getElementById('plan-spec-ram'),
  planSpecTier: document.getElementById('plan-spec-tier'),
  planSpecBackups: document.getElementById('plan-spec-backups'),
  planSpecConnected: document.getElementById('plan-spec-connected'),
  planSpecCard: document.querySelector('.plan-specs-card')
};

// Initialize Page Load
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serverName = urlParams.get('name');

  if (!serverName) {
    // Redirect back if no name provided
    window.location.href = '../index.html';
    return;
  }

  // 1. Load initial server details
  await loadServerDetails(serverName);

  // 2. Resolve Minecraft UUID once in background (non-blocking)
  resolveMinecraftUUID(window.currentOwner).then(uuid => {
    if (uuid) {
      window.currentOwnerUUID = uuid;
      // Update the avatar image to use the UUID (more reliable than username for skins)
      const avatarEl = document.querySelector('.owner-avatar');
      if (avatarEl) {
        avatarEl.src = `https://crafthead.net/avatar/${uuid}`;
      }
      const dashAvatarEl = document.querySelector('.dash-owner-avatar');
      if (dashAvatarEl) {
        dashAvatarEl.src = `https://crafthead.net/avatar/${uuid}`;
      }
      
      // Update Minecraft UUID card
      const mcUuidCard = document.getElementById('card-mc-uuid');
      const mcUuidVal = document.getElementById('stat-mc-uuid');
      if (mcUuidCard && mcUuidVal) {
        mcUuidVal.textContent = uuid;
        mcUuidCard.style.display = 'flex'; // show the card
      }
    }
  });

  // 3. Setup background auto-refresh every 5 seconds for Minehut API stats
  setInterval(async () => {
    await updateServerDetailsLive(serverName);
  }, 5000);
});

// Resolve Minecraft UUID from username (using CORS-friendly PlayerDB with Mojang fallback)
async function resolveMinecraftUUID(username) {
  if (!username || username === 'Unknown') return null;
  
  try {
    // 1. Try PlayerDB first as it has CORS enabled
    const res = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(username)}`);
    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data && body.data.player) {
        return body.data.player.raw_id || body.data.player.id;
      }
    }
  } catch (e) {
    console.warn("PlayerDB lookup failed, trying Mojang direct:", e);
  }
  
  try {
    // 2. Try Mojang direct (if run in environment bypassing CORS)
    const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
  } catch (e) {
    console.warn("Mojang direct lookup failed:", e);
  }
  
  return null;
}

// Load details of a specific server
async function loadServerDetails(name) {
  let serverData = null;
  let isMocked = false;

  // Resolve Owner username and rank from URL parameters or fallbacks
  const urlParams = new URLSearchParams(window.location.search);
  let ownerName = urlParams.get('owner');
  let ownerRank = urlParams.get('rank');

  if (!ownerName) {
    const matched = window.MinehutMockData && window.MinehutMockData.servers 
      ? window.MinehutMockData.servers.find(s => s.name.toLowerCase() === name.toLowerCase())
      : null;
    if (matched) {
      ownerName = matched.author;
      ownerRank = matched.authorRank;
    }
  }

  window.currentOwner = ownerName || 'Unknown';
  window.currentRank = ownerRank || 'DEFAULT';



  try {
    const res = await fetch(`https://api.minehut.com/server/${encodeURIComponent(name)}?byName=true`);
    if (!res.ok) throw new Error('Detail Fetch Failed');
    const data = await res.json();
    serverData = data.server;
  } catch (err) {
    console.warn(`Failed to fetch live detail for server "${name}", using fallback mock database:`, err);
    const mockDetail = window.MinehutMockData.getServerDetailByName(name);
    if (mockDetail) {
      serverData = mockDetail.server;
      isMocked = true;
    }
  }

  if (!serverData) {
    // Render not found screen
    renderNotFound(name);
    return;
  }

  renderServerDetails(serverData);

  if (isMocked) {
    showFallbackToast();
  }
}

// Asynchronously update server stats from the Minehut API every 5 seconds
async function updateServerDetailsLive(name) {
  try {
    const res = await fetch(`https://api.minehut.com/server/${encodeURIComponent(name)}?byName=true`);
    if (!res.ok) throw new Error('Live Update Fetch Failed');
    const data = await res.json();
    if (data && data.server) {
      renderServerDetails(data.server);
      
      // Retain resolved Minecraft UUID avatar if we have it
      if (window.currentOwnerUUID) {
        const avatarEl = document.querySelector('.owner-avatar');
        if (avatarEl) avatarEl.src = `https://crafthead.net/avatar/${window.currentOwnerUUID}`;
        const dashAvatarEl = document.querySelector('.dash-owner-avatar');
        if (dashAvatarEl) dashAvatarEl.src = `https://crafthead.net/avatar/${window.currentOwnerUUID}`;
      }
    }
  } catch (err) {
    console.debug('Background live update polling failed (likely CORS or offline):', err);
  }
}

// Get normalized plan badge label and visual CSS class
function getPlanBadgeInfo(planString) {
  if (!planString) return { label: 'FREE', className: 'badge-plan-free' };
  
  const lower = planString.toLowerCase().replace(/_/g, ' ').trim();
  
  if (lower.startsWith('custom') || lower.includes('custom')) {
    return { label: 'CUSTOM', className: 'badge-plan-custom' };
  }
  if (lower.includes('external')) {
    return { label: 'EXTERNAL', className: 'badge-plan-external' };
  }
  if (lower.includes('pro')) {
    return { label: lower.includes('yearly') ? 'PRO (Y)' : 'PRO', className: 'badge-plan-pro' };
  }
  if (lower.includes('ultimate')) {
    return { label: lower.includes('yearly') ? 'ULTIMATE (Y)' : 'ULTIMATE', className: 'badge-plan-ultimate' };
  }
  if (lower.includes('standard')) {
    return { label: lower.includes('yearly') ? 'STANDARD (Y)' : 'STANDARD', className: 'badge-plan-standard' };
  }
  if (lower.includes('ultra')) {
    return { label: 'ULTRA', className: 'badge-plan-ultra' };
  }
  
  return { label: 'FREE', className: 'badge-plan-free' };
}

// Render server data to DOM
function renderServerDetails(server) {
  // 1. Setup Banner Color / Image
  const tint = server.default_banner_tint || '#8B5CF6';
  els.banner.style.background = `linear-gradient(to right, ${tint}, rgba(9, 8, 15, 0.95))`;
  els.banner.style.borderBottom = `2px solid ${tint}`;

  // 2. Set Icon Emoji based on Name/Plan
  const emojis = ['🎮', '⚔️', '🌟', '🔥', '🛡️', '🌍', '💎'];
  const charSum = server.name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const selectedEmoji = emojis[charSum % emojis.length];
  els.serverIcon.textContent = selectedEmoji;

  // 3. Set Name and Meta tags
  els.serverName.textContent = server.name;
  
  // Set Owner Subtitle in Header
  let rankBadgeHtml = '';
  if (window.currentRank && window.currentRank !== 'DEFAULT') {
    const rank = window.currentRank.toUpperCase();
    let rankClass = 'badge-rank-vip';
    if (rank.includes('ADMIN')) rankClass = 'badge-rank-admin';
    if (rank.includes('DEV')) rankClass = 'badge-rank-dev';
    if (rank.includes('PRO')) rankClass = 'badge-rank-pro';
    rankBadgeHtml = `<span class="badge ${rankClass}" style="margin-left: 6px;">${rank}</span>`;
  }
  const avatarUrl = `https://crafthead.net/avatar/${encodeURIComponent(window.currentOwner)}`;
  els.detailServerOwner.innerHTML = `
    <img src="${avatarUrl}" alt="${window.currentOwner}" class="owner-avatar" style="width: 22px; height: 22px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-color);" />
    by <span style="font-weight: 700; color: var(--text-primary);">${window.currentOwner}</span> ${rankBadgeHtml}
  `;
  
  // Clear existing badges to prevent duplication on auto-refresh updates
  els.metaTags.innerHTML = '';

  // Status Badge
  const isOnline = server.online || server.playerCount > 0;
  const statusBadge = document.createElement('span');
  statusBadge.className = `badge ${isOnline ? 'badge-plan-external' : 'badge-plan-free'}`;
  statusBadge.style.background = isOnline ? 'rgba(16, 185, 129, 0.2)' : '#3f3f46';
  statusBadge.style.color = isOnline ? '#34d399' : '#e4e4e7';
  statusBadge.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
  els.metaTags.appendChild(statusBadge);

  // Plan Badge
  const activePlan = server.server_plan || server.activeServerPlan || 'FREE';
  const planInfo = getPlanBadgeInfo(activePlan);
  const planBadge = document.createElement('span');
  planBadge.className = `badge ${planInfo.className}`;
  planBadge.textContent = planInfo.label;
  els.metaTags.appendChild(planBadge);

  // Platform Badge
  const platformBadge = document.createElement('span');
  platformBadge.className = 'platform-tag';
  platformBadge.textContent = server.platform ? server.platform.toUpperCase() : 'JAVA';
  els.metaTags.appendChild(platformBadge);

  // 4. IP Information
  const connectionIp = `${server.name}.minehut.gg`;
  els.serverIp.textContent = connectionIp;

  // Clipboard copy action listener
  els.btnCopyIp.addEventListener('click', () => {
    navigator.clipboard.writeText(connectionIp).then(() => {
      // Success feedback
      const originalText = els.copyText.textContent;
      els.copyText.textContent = 'Copied!';
      els.btnCopyIp.style.background = 'var(--accent-emerald)';
      els.btnCopyIp.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
      
      // Update Copy Icon to a checkmark SVG
      const oldSvgHtml = els.copyIcon.innerHTML;
      els.copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';

      // Trigger Toast Notification
      els.toastTitle.textContent = "IP Address Copied!";
      els.toastDesc.textContent = `Copied ${connectionIp} to clipboard. Paste in Minecraft to play!`;
      els.toast.classList.add('show');

      setTimeout(() => {
        // Revert
        els.copyText.textContent = originalText;
        els.btnCopyIp.style.background = '';
        els.btnCopyIp.style.boxShadow = '';
        els.copyIcon.innerHTML = oldSvgHtml;
      }, 2000);

      setTimeout(() => {
        els.toast.classList.remove('show');
      }, 5000);
    });
  });

  // 5. MOTD Parsing
  els.serverMotd.innerHTML = parseMinecraftMOTD(server.motd || 'A Minehut Server.');

  // 6. Dash Stats Cards
  els.statUptime.textContent = isOnline ? 'Online' : 'Offline';
  els.statUptime.style.color = isOnline ? 'var(--accent-emerald)' : 'var(--text-muted)';
  
  els.statSlots.textContent = `${server.playerCount} / ${server.maxPlayers || 10}`;
  els.statPlan.textContent = server.server_plan || 'FREE';
  els.statCredits.textContent = server.credits_per_day ? `${server.credits_per_day} c/d` : '0 c/d';
  els.statVersion.textContent = server.server_version_type || 'PAPER';
  
  // Format Date
  if (server.creation) {
    els.statCreated.textContent = new Date(server.creation).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    els.statCreated.textContent = 'Unknown';
  }

  // Joins Counter
  els.statJoins.textContent = server.joins ? new Intl.NumberFormat().format(server.joins) : '0';

  // Uptime hours display
  let uptimePercent = 99.4; // standard default mock
  if (server.daily_online_time) {
    const dates = Object.keys(server.daily_online_time);
    if (dates.length > 0) {
      const activeMs = server.daily_online_time[dates[0]];
      // Convert MS online to percent of 24h
      const dayMs = 24 * 60 * 60 * 1000;
      uptimePercent = Math.min(Math.round((activeMs / dayMs) * 1000) / 10, 100);
    }
  }
  els.statDailyUptime.textContent = `${uptimePercent}% Uptime`;
  
  // Populate Owner Stats
  els.statOwner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="${avatarUrl}" class="dash-owner-avatar" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-color);" />
      <span>${window.currentOwner}</span>
    </div>
  `;
  els.statOwnerId.textContent = server.owner || 'N/A';

  // 7. Categories pills
  const categories = server.categories || server.inheritedCategories || [];
  if (categories.length === 0) {
    els.categoriesList.innerHTML = '<span class="text-muted" style="font-size: 14px; color: var(--text-muted);">No categories tagged.</span>';
  } else {
    els.categoriesList.innerHTML = '';
    categories.forEach(cat => {
      const pill = document.createElement('span');
      pill.className = 'detail-category-tag';
      pill.textContent = cat.toLowerCase();
      els.categoriesList.appendChild(pill);
    });
  }

  // 8. Plugins list
  const plugins = server.minehut_plugins || [];
  if (plugins.length === 0) {
    els.pluginsSection.style.display = 'none'; // hide if no plugins
  } else {
    els.pluginsList.innerHTML = '';
    plugins.forEach(plug => {
      const pTag = document.createElement('span');
      pTag.className = 'plugin-tag';
      pTag.textContent = plug;
      els.pluginsList.appendChild(pTag);
    });
  }

  // 9. Update Plan Specifications Card
  const specs = getPlanSpecs(activePlan);
  
  if (els.planSpecBadge) {
    els.planSpecBadge.textContent = specs.shortName;
    els.planSpecBadge.className = `plan-badge-large badge ${planInfo.className}`;
  }
  if (els.planSpecCost) els.planSpecCost.textContent = specs.cost;
  if (els.planSpecPlayers) els.planSpecPlayers.textContent = specs.players;
  if (els.planSpecRam) els.planSpecRam.textContent = specs.ram;
  if (els.planSpecTier) els.planSpecTier.textContent = specs.tier;
  if (els.planSpecBackups) els.planSpecBackups.textContent = specs.backups;
  if (els.planSpecConnected) els.planSpecConnected.textContent = specs.connected;
  
  if (els.planSpecCard) {
    els.planSpecCard.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px ${specs.themeGlow}`;
    els.planSpecCard.style.borderColor = specs.themeBorder;
  }
}

// Plan resource specifications definitions
const PLAN_SPECS = {
  starter: {
    name: "Starter (Free)",
    shortName: "Starter",
    cost: "0 Credits / Day (Free)",
    players: "10 Players",
    ram: "1 GB RAM",
    tier: "Basic Server",
    backups: "4 hours / day backups",
    connected: "None",
    themeGlow: "rgba(113, 113, 122, 0.15)",
    themeBorder: "rgba(113, 113, 122, 0.3)"
  },
  free: {
    name: "Starter (Free)",
    shortName: "Starter",
    cost: "0 Credits / Day (Free)",
    players: "10 Players",
    ram: "1 GB RAM",
    tier: "Basic Server",
    backups: "4 hours / day backups",
    connected: "None",
    themeGlow: "rgba(113, 113, 122, 0.15)",
    themeBorder: "rgba(113, 113, 122, 0.3)"
  },
  standard: {
    name: "Standard Plan",
    shortName: "Standard",
    cost: "600 Credits / Month (6,000 / Year)",
    players: "Unlimited Players",
    ram: "2 GB RAM",
    tier: "Standard Server",
    backups: "Unlimited Backups",
    connected: "1 Server Link",
    themeGlow: "rgba(6, 182, 212, 0.15)",
    themeBorder: "rgba(6, 182, 212, 0.3)"
  },
  "yearly standard": {
    name: "Standard Plan (Yearly)",
    shortName: "Standard",
    cost: "6,000 Credits / Year (2 Months Free!)",
    players: "Unlimited Players",
    ram: "2 GB RAM",
    tier: "Standard Server",
    backups: "Unlimited Backups",
    connected: "1 Server Link",
    themeGlow: "rgba(6, 182, 212, 0.15)",
    themeBorder: "rgba(6, 182, 212, 0.3)"
  },
  pro: {
    name: "Pro Plan",
    shortName: "Pro",
    cost: "1,800 Credits / Month (18,000 / Year)",
    players: "Unlimited Players",
    ram: "6 GB RAM",
    tier: "Standard Server",
    backups: "Unlimited Backups",
    connected: "3 Server Links",
    themeGlow: "rgba(139, 92, 246, 0.15)",
    themeBorder: "rgba(139, 92, 246, 0.3)"
  },
  "yearly pro": {
    name: "Pro Plan (Yearly)",
    shortName: "Pro",
    cost: "18,000 Credits / Year (2 Months Free!)",
    players: "Unlimited Players",
    ram: "6 GB RAM",
    tier: "Standard Server",
    backups: "Unlimited Backups",
    connected: "3 Server Links",
    themeGlow: "rgba(139, 92, 246, 0.15)",
    themeBorder: "rgba(139, 92, 246, 0.3)"
  },
  ultimate: {
    name: "Ultimate Plan",
    shortName: "Ultimate",
    cost: "6,000 Credits / Month (60,000 / Year)",
    players: "Unlimited Players",
    ram: "14 GB RAM",
    tier: "Pro Server",
    backups: "Online 24/7 Uptime",
    connected: "6 Server Links",
    themeGlow: "rgba(239, 68, 68, 0.15)",
    themeBorder: "rgba(239, 68, 68, 0.3)"
  },
  "yearly ultimate": {
    name: "Ultimate Plan (Yearly)",
    shortName: "Ultimate",
    cost: "60,000 Credits / Year (2 Months Free!)",
    players: "Unlimited Players",
    ram: "14 GB RAM",
    tier: "Pro Server",
    backups: "Online 24/7 Uptime",
    connected: "6 Server Links",
    themeGlow: "rgba(239, 68, 68, 0.15)",
    themeBorder: "rgba(239, 68, 68, 0.3)"
  },
  external: {
    name: "External Server",
    shortName: "External",
    cost: "Direct Connected / External",
    players: "Unlimited Players",
    ram: "Custom RAM (Self-hosted)",
    tier: "External Server Node",
    backups: "Self-Managed Backups",
    connected: "Direct Connection Link",
    themeGlow: "rgba(16, 185, 129, 0.15)",
    themeBorder: "rgba(16, 185, 129, 0.3)"
  },
  "external server": {
    name: "External Server",
    shortName: "External",
    cost: "Direct Connected / External",
    players: "Unlimited Players",
    ram: "Custom RAM (Self-hosted)",
    tier: "External Server Node",
    backups: "Self-Managed Backups",
    connected: "Direct Connection Link",
    themeGlow: "rgba(16, 185, 129, 0.15)",
    themeBorder: "rgba(16, 185, 129, 0.3)"
  },
  custom: {
    name: "Custom Plan",
    shortName: "Custom",
    cost: "Starts at 600 Credits / Month",
    players: "Unlimited Players",
    ram: "Up to 32 GB RAM",
    tier: "Standard or Pro Server",
    backups: "Unlimited or 24/7 Uptime",
    connected: "1 Server Link",
    themeGlow: "rgba(245, 158, 11, 0.15)",
    themeBorder: "rgba(245, 158, 11, 0.3)"
  }
};

// Get plan specs helper function
function getPlanSpecs(planString) {
  if (!planString) return PLAN_SPECS.free;
  
  const lower = planString.toLowerCase().trim();
  if (lower.startsWith('custom') || lower.includes('custom')) {
    return PLAN_SPECS.custom;
  }
  if (PLAN_SPECS[lower]) {
    return PLAN_SPECS[lower];
  }
  
  // Default fallback
  return {
    name: planString.toUpperCase(),
    shortName: planString.toUpperCase(),
    cost: "Varies",
    players: "Unlimited",
    ram: "Custom",
    tier: "Standard Server",
    backups: "Unlimited Backups",
    connected: "Varies",
    themeGlow: "rgba(139, 92, 246, 0.15)",
    themeBorder: "rgba(139, 92, 246, 0.3)"
  };
}

// Render "Server Not Found" screen
function renderNotFound(name) {
  const cardBody = document.querySelector('.detail-card-body');
  els.banner.style.background = 'linear-gradient(to right, var(--accent-red), rgba(9, 8, 15, 0.95))';
  els.banner.style.borderBottom = '2px solid var(--accent-red)';
  els.serverIcon.textContent = '❌';
  els.serverName.textContent = 'Server Not Found';
  
  cardBody.innerHTML = `
    <div style="text-align: center; padding: 48px 24px;">
      <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">We couldn't retrieve statistics for "${name}"</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 32px auto; font-size: 15px;">
        This server might be deleted, privatized, or misspelled. Make sure the spelling matches Minehut's records.
      </p>
      <a href="../index.html" class="btn-copy" style="display: inline-flex; justify-content: center; align-items: center; max-width: 200px; margin: 0 auto; text-decoration: none;">
        Back to Search
      </a>
    </div>
  `;
}

// Show toast fallback notification
function showFallbackToast() {
  els.toastTitle.textContent = "Offline/Mock Data Active";
  els.toastDesc.textContent = "Showing mockup server profile due to local browser CORS blockages.";
  els.toast.style.borderColor = "var(--accent-purple)";
  els.toast.classList.add('show');
  
  setTimeout(() => {
    els.toast.classList.remove('show');
  }, 5000);
}
