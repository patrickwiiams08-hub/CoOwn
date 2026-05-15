const STORAGE_KEY = "coown-demo-state-v1";
const ADMIN_EMAIL = "admin@coown.test";
const ADMIN_PASSWORD = "Admin123!";
const placeholderSvg = (label, a = "5be7c4", b = "8b5cf6") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#${a}"/><stop offset="1" stop-color="#${b}"/></linearGradient></defs><rect width="800" height="520" fill="#0e1424"/><circle cx="650" cy="80" r="190" fill="url(#g)" opacity=".35"/><circle cx="80" cy="460" r="170" fill="url(#g)" opacity=".22"/><rect x="70" y="80" width="660" height="360" rx="42" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)"/><text x="400" y="250" fill="white" font-family="Inter,Arial" font-size="52" font-weight="800" text-anchor="middle">${label}</text><text x="400" y="310" fill="#d8fff4" font-family="Inter,Arial" font-size="24" font-weight="700" text-anchor="middle">Fractional Asset</text></svg>`)}`;

const seedAssets = [
  {
    id: "asset-gt3",
    name: "Porsche 911 GT3 Allocation",
    category: "Cars",
    description: "A fractionalized collector sports car position with strong enthusiast demand and limited supply.",
    image: placeholderSvg("Porsche GT3", "5be7c4", "0ea5e9"),
    valuation: 228000,
    totalShares: 22800,
    availableShares: 14720,
    basePrice: 10,
    views: 930,
    watchlists: 244,
    trades: 186,
    featured: true,
    status: "approved",
    owner: "CoOwn Demo Desk",
    history: [9.72, 9.83, 9.91, 10.04, 10.12, 10.31, 10.47, 10.64, 10.91, 11.08],
  },
  {
    id: "asset-warhol",
    name: "Pop Art Blue-Chip Print",
    category: "Art",
    description: "Editioned contemporary print with transparent share count, trade history, and demand tracking.",
    image: placeholderSvg("Blue-Chip Art", "ffd166", "ef476f"),
    valuation: 120000,
    totalShares: 12000,
    availableShares: 6530,
    basePrice: 10,
    views: 680,
    watchlists: 155,
    trades: 121,
    featured: true,
    status: "approved",
    owner: "CoOwn Demo Desk",
    history: [9.86, 9.95, 10.02, 10.01, 10.12, 10.21, 10.2, 10.36, 10.55, 10.62],
  },
  {
    id: "asset-rolex",
    name: "Rolex Daytona Panda",
    category: "Watches",
    description: "Luxury watch shares with marketplace-driven demand signals and limited float.",
    image: placeholderSvg("Daytona", "f8fafc", "64748b"),
    valuation: 42000,
    totalShares: 4200,
    availableShares: 1100,
    basePrice: 10,
    views: 1040,
    watchlists: 321,
    trades: 210,
    featured: false,
    status: "approved",
    owner: "CoOwn Demo Desk",
    history: [10.1, 10.18, 10.23, 10.42, 10.5, 10.71, 10.84, 11.04, 11.14, 11.32],
  },
  {
    id: "asset-villa",
    name: "Miami Vacation Villa Income",
    category: "Real Estate",
    description: "Demo fractional income-oriented asset with simulated occupancy and secondary market trading.",
    image: placeholderSvg("Miami Villa", "38bdf8", "8b5cf6"),
    valuation: 875000,
    totalShares: 87500,
    availableShares: 49100,
    basePrice: 10,
    views: 540,
    watchlists: 102,
    trades: 98,
    featured: false,
    status: "approved",
    owner: "CoOwn Demo Desk",
    history: [9.92, 9.9, 9.96, 10.05, 10.12, 10.17, 10.26, 10.34, 10.36, 10.44],
  },
];

let state = loadState();
let selectedAssetId = state.assets.find((asset) => asset.status === "approved")?.id;

const elements = {
  assetGrid: document.querySelector("#assetGrid"),
  categoryFilter: document.querySelector("#categoryFilter"),
  searchInput: document.querySelector("#searchInput"),
  sortFilter: document.querySelector("#sortFilter"),
  deskTitle: document.querySelector("#deskTitle"),
  deskBadge: document.querySelector("#deskBadge"),
  priceChart: document.querySelector("#priceChart"),
  chartStats: document.querySelector("#chartStats"),
  orderAssetText: document.querySelector("#orderAssetText"),
  shareAmount: document.querySelector("#shareAmount"),
  quoteTotal: document.querySelector("#quoteTotal"),
  holdingText: document.querySelector("#holdingText"),
  buyButton: document.querySelector("#buyButton"),
  sellButton: document.querySelector("#sellButton"),
  loginButton: document.querySelector("#loginButton"),
  logoutButton: document.querySelector("#logoutButton"),
  loginDialog: document.querySelector("#loginDialog"),
  loginForm: document.querySelector("#loginForm"),
  assetForm: document.querySelector("#assetForm"),
  adminPanel: document.querySelector("#adminPanel"),
  portfolioList: document.querySelector("#portfolioList"),
  tickerStrip: document.querySelector("#tickerStrip"),
  spotlightCard: document.querySelector("#spotlightCard"),
  toast: document.querySelector("#toast"),
  resetDemoBtn: document.querySelector("#resetDemoBtn"),
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    currentUser: null,
    assets: seedAssets,
    holdings: {},
    users: [{ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin", name: "CoOwn Admin" }],
    volume: 124850,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value > 100 ? 0 : 2 }).format(value);
}

function getCurrentPrice(asset) {
  const utilization = (asset.totalShares - asset.availableShares) / asset.totalShares;
  const demandScore = Math.min(1, asset.views / 1500 + asset.watchlists / 550 + asset.trades / 420);
  const last = asset.history.at(-1) ?? asset.basePrice;
  const previous = asset.history.at(-4) ?? asset.basePrice;
  const momentum = Math.max(-0.08, Math.min(0.18, (last - previous) / previous));
  const scarcity = Math.max(0, 1 - asset.availableShares / asset.totalShares) * 0.1;
  const multiplier = 1 + demandScore * 0.03 + utilization * 0.35 + momentum * 0.12 + scarcity;
  return Math.max(0.25, asset.basePrice * multiplier);
}

function getChange(asset) {
  const first = asset.history[0] ?? asset.basePrice;
  const price = getCurrentPrice(asset);
  return ((price - first) / first) * 100;
}

function getDemand(asset) {
  return Math.round(Math.min(99, asset.views * 0.025 + asset.watchlists * 0.12 + asset.trades * 0.16 + (1 - asset.availableShares / asset.totalShares) * 30));
}

function approvedAssets() {
  return state.assets.filter((asset) => asset.status === "approved");
}

function render() {
  renderHeader();
  renderFilters();
  renderMarketplace();
  renderDesk();
  renderPortfolio();
  renderAdmin();
  renderHeroStats();
}

function renderHeader() {
  if (state.currentUser) {
    elements.loginButton.textContent = state.currentUser.role === "admin" ? "Admin logged in" : state.currentUser.email;
    elements.loginButton.disabled = true;
    elements.logoutButton.classList.remove("hidden");
  } else {
    elements.loginButton.textContent = "Login";
    elements.loginButton.disabled = false;
    elements.logoutButton.classList.add("hidden");
  }
}

function renderHeroStats() {
  document.querySelector("#statAssets").textContent = approvedAssets().length;
  document.querySelector("#statVolume").textContent = formatCurrency(state.volume);
  document.querySelector("#statTraders").textContent = state.users.length + 143;
  const movers = [...approvedAssets()].sort((a, b) => getDemand(b) - getDemand(a)).slice(0, 4);
  elements.tickerStrip.innerHTML = movers.map((asset) => `<div class="ticker-chip"><strong>${asset.name.split(" ").slice(0, 2).join(" ")}</strong><span>${formatCurrency(getCurrentPrice(asset))} · ${getChange(asset).toFixed(1)}%</span></div>`).join("");
  const spotlight = movers[0];
  if (!spotlight) return;
  elements.spotlightCard.innerHTML = `<img src="${spotlight.image}" alt="${spotlight.name}"><div class="spotlight-body"><span class="badge gold">Trending</span><h3>${spotlight.name}</h3><p class="muted">${spotlight.description}</p><div class="price-line"><span>Share price</span><strong>${formatCurrency(getCurrentPrice(spotlight))}</strong></div></div>`;
}

function renderFilters() {
  const currentCategory = elements.categoryFilter.value || "all";
  const categories = ["all", ...new Set(approvedAssets().map((asset) => asset.category))];
  elements.categoryFilter.innerHTML = categories.map((category) => `<option value="${category}">${category === "all" ? "All categories" : category}</option>`).join("");
  elements.categoryFilter.value = categories.includes(currentCategory) ? currentCategory : "all";
}

function renderMarketplace() {
  const query = elements.searchInput.value.toLowerCase();
  const category = elements.categoryFilter.value;
  const sortBy = elements.sortFilter.value;
  let assets = approvedAssets().filter((asset) => {
    const matchesSearch = `${asset.name} ${asset.category} ${asset.description}`.toLowerCase().includes(query);
    const matchesCategory = category === "all" || asset.category === category;
    return matchesSearch && matchesCategory;
  });
  assets.sort((a, b) => {
    if (sortBy === "demand") return getDemand(b) - getDemand(a);
    if (sortBy === "priceAsc") return getCurrentPrice(a) - getCurrentPrice(b);
    if (sortBy === "priceDesc") return getCurrentPrice(b) - getCurrentPrice(a);
    return Number(b.featured) - Number(a.featured) || getDemand(b) - getDemand(a);
  });
  elements.assetGrid.innerHTML = assets.map(assetCard).join("") || `<p class="muted">No assets match that search.</p>`;
}

function assetCard(asset) {
  const price = getCurrentPrice(asset);
  const change = getChange(asset);
  const demand = getDemand(asset);
  return `<article class="asset-card">
    <img src="${asset.image}" alt="${asset.name}">
    <div class="asset-body">
      <div class="asset-topline"><h3>${asset.name}</h3><span class="badge ${asset.featured || demand > 65 ? "gold" : ""}">${asset.featured ? "Featured" : demand > 65 ? "Hot" : asset.category}</span></div>
      <p class="muted">${asset.description}</p>
      <div class="asset-meta"><span>${asset.category}</span><span>${asset.availableShares.toLocaleString()} shares left</span><span>Demand ${demand}/99</span></div>
      <div class="price-line"><span>Share price</span><strong>${formatCurrency(price)}</strong></div>
      <div class="${change >= 0 ? "change-positive" : "change-negative"}">${change >= 0 ? "+" : ""}${change.toFixed(2)}% simulated appreciation</div>
      <div class="asset-actions"><button class="secondary-btn" type="button" data-watch="${asset.id}">Watch</button><button class="primary-btn" type="button" data-select="${asset.id}">Trade</button></div>
    </div>
  </article>`;
}

function renderDesk() {
  const asset = state.assets.find((item) => item.id === selectedAssetId) || approvedAssets()[0];
  if (!asset) return;
  selectedAssetId = asset.id;
  const price = getCurrentPrice(asset);
  const shares = Math.max(1, Number(elements.shareAmount.value || 1));
  elements.deskTitle.textContent = asset.name;
  elements.deskBadge.textContent = `${asset.category} · Demand ${getDemand(asset)}/99`;
  elements.orderAssetText.textContent = `${formatCurrency(price)} per share · ${asset.availableShares.toLocaleString()} of ${asset.totalShares.toLocaleString()} shares available.`;
  elements.quoteTotal.textContent = formatCurrency(price * shares);
  const holding = getHolding(asset.id);
  elements.holdingText.textContent = state.currentUser ? `You own ${holding.toLocaleString()} shares in this asset.` : "Login to track your holdings.";
  drawChart(asset);
}

function drawChart(asset) {
  const canvas = elements.priceChart;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 720;
  const cssHeight = 280;
  const width = cssWidth * ratio;
  const height = cssHeight * ratio;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  const prices = [...asset.history, getCurrentPrice(asset)];
  const min = Math.min(...prices) * 0.985;
  const max = Math.max(...prices) * 1.015;
  const pad = { top: 22 * ratio, right: 22 * ratio, bottom: 34 * ratio, left: 58 * ratio };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const pointFor = (price, index) => ({
    x: pad.left + (index / (prices.length - 1)) * chartWidth,
    y: pad.top + (1 - (price - min) / (max - min)) * chartHeight,
  });
  const points = prices.map(pointFor);

  ctx.fillStyle = "#f7f8fb";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
  ctx.lineWidth = ratio;
  ctx.font = `${11 * ratio}px Inter, sans-serif`;
  ctx.fillStyle = "rgba(71, 85, 105, 0.72)";
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartHeight / 4) * i;
    const value = max - ((max - min) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatCurrency(value), 10 * ratio, y + 4 * ratio);
  }

  const areaGradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  areaGradient.addColorStop(0, "rgba(0, 122, 255, 0.20)");
  areaGradient.addColorStop(0.58, "rgba(0, 122, 255, 0.055)");
  areaGradient.addColorStop(1, "rgba(0, 122, 255, 0)");
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else {
      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;
      ctx.bezierCurveTo(midX, previous.y, midX, point.y, point.x, point.y);
    }
  });
  ctx.lineTo(points.at(-1).x, height - pad.bottom);
  ctx.lineTo(points[0].x, height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = areaGradient;
  ctx.fill();

  const lineGradient = ctx.createLinearGradient(pad.left, 0, width - pad.right, 0);
  lineGradient.addColorStop(0, "#111827");
  lineGradient.addColorStop(0.55, "#007aff");
  lineGradient.addColorStop(1, "#34c759");
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 3.5 * ratio;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else {
      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;
      ctx.bezierCurveTo(midX, previous.y, midX, point.y, point.x, point.y);
    }
  });
  ctx.stroke();

  const lastPoint = points.at(-1);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#007aff";
  ctx.lineWidth = 3 * ratio;
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 5.5 * ratio, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(71, 85, 105, 0.72)";
  ctx.fillText("30D", pad.left, height - 10 * ratio);
  ctx.fillText("Today", width - pad.right - 34 * ratio, height - 10 * ratio);

  const change = getChange(asset);
  elements.chartStats.innerHTML = `<span>Open ${formatCurrency(prices[0])}</span><span>High ${formatCurrency(Math.max(...prices))}</span><span>Low ${formatCurrency(Math.min(...prices))}</span><strong class="${change >= 0 ? "change-positive" : "change-negative"}">${change >= 0 ? "+" : ""}${change.toFixed(2)}%</strong>`;
}

function getHolding(assetId) {
  if (!state.currentUser) return 0;
  return state.holdings[state.currentUser.email]?.[assetId] ?? 0;
}

function requireLogin() {
  if (state.currentUser) return true;
  elements.loginDialog.showModal();
  return false;
}

function tradeAsset(direction) {
  if (!requireLogin()) return;
  const asset = state.assets.find((item) => item.id === selectedAssetId);
  const shares = Math.max(1, Math.floor(Number(elements.shareAmount.value || 1)));
  const price = getCurrentPrice(asset);
  state.holdings[state.currentUser.email] ||= {};
  if (direction === "buy") {
    if (asset.availableShares < shares) return showToast("Not enough shares available.");
    asset.availableShares -= shares;
    asset.trades += shares;
    asset.views += 12;
    state.holdings[state.currentUser.email][asset.id] = getHolding(asset.id) + shares;
    state.volume += price * shares;
    appendMarketTick(asset, 0.004 + shares / asset.totalShares);
    showToast(`Bought ${shares} shares of ${asset.name}.`);
  } else {
    if (getHolding(asset.id) < shares) return showToast("You do not own enough shares to sell.");
    asset.availableShares += shares;
    asset.trades += Math.ceil(shares / 2);
    state.holdings[state.currentUser.email][asset.id] = getHolding(asset.id) - shares;
    state.volume += price * shares;
    appendMarketTick(asset, -0.002 + shares / asset.totalShares / 2);
    showToast(`Sold ${shares} shares of ${asset.name}.`);
  }
  saveState();
  render();
}

function appendMarketTick(asset, pressure) {
  const last = asset.history.at(-1) ?? asset.basePrice;
  const noise = (Math.random() - 0.42) * 0.035;
  asset.history.push(Math.max(0.25, last * (1 + pressure + noise)));
  if (asset.history.length > 20) asset.history.shift();
}

function renderPortfolio() {
  if (!state.currentUser) {
    elements.portfolioList.innerHTML = `<p class="muted">Login to see shares you buy in the demo marketplace.</p>`;
    return;
  }
  const holdings = state.holdings[state.currentUser.email] || {};
  const rows = Object.entries(holdings).filter(([, shares]) => shares > 0).map(([assetId, shares]) => {
    const asset = state.assets.find((item) => item.id === assetId);
    return `<div class="portfolio-row"><img src="${asset.image}" alt="${asset.name}"><div><strong>${asset.name}</strong><p class="small-note">${shares.toLocaleString()} shares · ${formatCurrency(shares * getCurrentPrice(asset))} market value</p></div><button class="secondary-btn" data-select="${asset.id}" type="button">Trade</button></div>`;
  });
  elements.portfolioList.innerHTML = rows.join("") || `<p class="muted">No holdings yet. Buy shares from the marketplace to build your portfolio.</p>`;
}

function renderAdmin() {
  const isAdmin = state.currentUser?.role === "admin";
  if (!isAdmin) {
    elements.adminPanel.innerHTML = `<p class="muted">Login with the demo admin account to approve uploads, feature listings, or remove assets.</p>`;
    return;
  }
  elements.adminPanel.innerHTML = state.assets.map((asset) => `<div class="admin-row">
    <img src="${asset.image}" alt="${asset.name}">
    <div><strong>${asset.name}</strong><p class="small-note">${asset.status.toUpperCase()} · ${asset.category} · ${asset.totalShares.toLocaleString()} shares · Uploaded by ${asset.owner}</p></div>
    <div class="admin-actions">
      <button class="secondary-btn" data-admin="approve" data-id="${asset.id}" type="button">Approve</button>
      <button class="ghost-btn" data-admin="feature" data-id="${asset.id}" type="button">${asset.featured ? "Unfeature" : "Feature"}</button>
      <button class="ghost-btn" data-admin="hide" data-id="${asset.id}" type="button">Hide</button>
      <button class="ghost-btn" data-admin="delete" data-id="${asset.id}" type="button">Delete</button>
    </div>
  </div>`).join("");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function submitAsset(event) {
  event.preventDefault();
  if (!requireLogin()) return;
  const valuation = Number(document.querySelector("#assetPrice").value);
  const totalShares = Number(document.querySelector("#assetShares").value);
  const uploadedImage = await readFileAsDataUrl(document.querySelector("#assetImageFile").files[0]);
  const imageUrl = document.querySelector("#assetImageUrl").value.trim();
  const name = document.querySelector("#assetName").value.trim();
  const asset = {
    id: `asset-${Date.now()}`,
    name,
    category: document.querySelector("#assetCategory").value.trim(),
    description: document.querySelector("#assetDescription").value.trim(),
    image: uploadedImage || imageUrl || placeholderSvg(name.slice(0, 18)),
    valuation,
    totalShares,
    availableShares: totalShares,
    basePrice: valuation / totalShares,
    views: 0,
    watchlists: 0,
    trades: 0,
    featured: false,
    status: state.currentUser.role === "admin" ? "approved" : "pending",
    owner: state.currentUser.email,
    history: Array.from({ length: 8 }, (_, index) => (valuation / totalShares) * (0.98 + index * 0.004)),
  };
  state.assets.unshift(asset);
  selectedAssetId = asset.id;
  saveState();
  elements.assetForm.reset();
  showToast(asset.status === "approved" ? "Asset published." : "Asset submitted for admin approval.");
  render();
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  let user = state.users.find((item) => item.email === email);
  if (email === ADMIN_EMAIL && password !== ADMIN_PASSWORD) return showToast("Use the correct admin password.");
  if (!user) {
    user = { email, password, role: email === ADMIN_EMAIL ? "admin" : "user", name: email.split("@")[0] };
    state.users.push(user);
  }
  if (user.password !== password) return showToast("Incorrect password for that demo account.");
  state.currentUser = { email: user.email, role: user.role, name: user.name };
  state.holdings[email] ||= {};
  saveState();
  elements.loginDialog.close();
  showToast(`Welcome ${user.role === "admin" ? "admin" : user.name}.`);
  render();
}

function handlePageClick(event) {
  const selectId = event.target.closest("[data-select]")?.dataset.select;
  const watchId = event.target.closest("[data-watch]")?.dataset.watch;
  const adminAction = event.target.closest("[data-admin]");
  if (selectId) {
    selectedAssetId = selectId;
    const asset = state.assets.find((item) => item.id === selectId);
    asset.views += 1;
    saveState();
    render();
    document.querySelector("#tradeDesk").scrollIntoView({ behavior: "smooth" });
  }
  if (watchId) {
    if (!requireLogin()) return;
    const asset = state.assets.find((item) => item.id === watchId);
    asset.watchlists += 1;
    saveState();
    showToast(`${asset.name} added to your watchlist.`);
    render();
  }
  if (adminAction) {
    if (state.currentUser?.role !== "admin") return;
    const asset = state.assets.find((item) => item.id === adminAction.dataset.id);
    const action = adminAction.dataset.admin;
    if (action === "approve") asset.status = "approved";
    if (action === "feature") asset.featured = !asset.featured;
    if (action === "hide") asset.status = asset.status === "hidden" ? "approved" : "hidden";
    if (action === "delete") state.assets = state.assets.filter((item) => item.id !== asset.id);
    saveState();
    render();
  }
}

elements.searchInput.addEventListener("input", renderMarketplace);
elements.categoryFilter.addEventListener("change", renderMarketplace);
elements.sortFilter.addEventListener("change", renderMarketplace);
elements.shareAmount.addEventListener("input", renderDesk);
elements.buyButton.addEventListener("click", () => tradeAsset("buy"));
elements.sellButton.addEventListener("click", () => tradeAsset("sell"));
elements.loginButton.addEventListener("click", () => elements.loginDialog.showModal());
elements.logoutButton.addEventListener("click", () => { state.currentUser = null; saveState(); render(); showToast("Logged out."); });
elements.loginForm.addEventListener("submit", handleLogin);
elements.assetForm.addEventListener("submit", submitAsset);
elements.resetDemoBtn.addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); state = loadState(); selectedAssetId = state.assets[0].id; render(); showToast("Demo data reset."); });
document.addEventListener("click", handlePageClick);
window.addEventListener("resize", () => renderDesk());

render();
