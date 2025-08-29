// Livestreams - fetch only active live broadcasts from one or more channels
(function(){
  // You can specify channel sources as channel IDs (UC...), @handles, or full URLs
  const CHANNEL_SOURCES = [
    '@sgmickan'
  ];

  const API_KEYS = [
    'AIzaSyBH6rwUrwR8tr0V-yK1uSJTDKtPtQmHR94',
    'AIzaSyC9XcEU4cYx_2WaaxXes_hSV-lpG9qC5jw',
    'AIzaSyCSp-PzSfHKwTPW6klr717HW1AzZlNKwMY'
  ];

  const liveGrid = document.getElementById('live-grid');
  const emptyState = document.getElementById('no-live');
  const errorState = document.getElementById('live-error');
  const toolbar = document.getElementById('live-toolbar');
  const lastUpdatedEl = document.getElementById('last-updated');
  const refreshBtn = document.getElementById('refresh-live');
  const loadingEl = document.getElementById('live-loading');
  const pastGrid = document.getElementById('past-grid');
  const pastLoadingEl = document.getElementById('past-loading');
  const noPastEl = document.getElementById('no-past');

  if (!liveGrid) return;

  async function fetchLiveForChannel(channelId){
    // Try api keys in order until success
    for (let i=0;i<API_KEYS.length;i++){
      const key = API_KEYS[i];
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&order=date&key=${key}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && !data.error) return data.items || [];
      } catch(e){
        // try next key
      }
    }
    return [];
  }

  async function tryWithKeys(buildUrl){
    for (let i=0;i<API_KEYS.length;i++){
      const key = API_KEYS[i];
      try {
        const res = await fetch(buildUrl(key));
        const data = await res.json();
        if (data && !data.error) return data;
      } catch(e){
        // continue
      }
    }
    return null;
  }

  function extractHandleOrNameFromUrl(url){
    try {
      const u = new URL(url);
      const seg = (u.pathname || '/').replace(/^\/+|\/+$/g,'').split('/');
      // formats: /@handle, /c/name, /channel/UC..., /user/legacy
      if (seg[0] && seg[0].startsWith('@')) return seg[0];
      if (seg[0] === 'c' && seg[1]) return '@' + seg[1];
      if (seg[0] === 'user' && seg[1]) return seg[1];
      if (seg[0] === 'channel' && seg[1]) return seg[1];
      if (seg[0]) return '@' + seg[0];
    } catch(e){
      // not a valid URL
    }
    return null;
  }

  async function resolveChannelId(source){
    // If already a channel ID
    if (/^UC[0-9A-Za-z_-]{20,}$/.test(source)) return source;
    // If URL, extract
    if (/^https?:\/\//i.test(source)){
      const h = extractHandleOrNameFromUrl(source);
      if (h) source = h;
    }
    // If handle format
    if (source.startsWith('@')){
      // Prefer forHandle if available
      const data = await tryWithKeys(key => `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(source)}&key=${key}`);
      if (data && data.items && data.items.length){
        return data.items[0].id;
      }
      // Fallback to search
      const search = await tryWithKeys(key => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(source.replace(/^@/,''))}&maxResults=1&key=${key}`);
      if (search && search.items && search.items.length){
        return search.items[0].snippet && search.items[0].snippet.channelId || search.items[0].id && search.items[0].id.channelId || null;
      }
      return null;
    }
    // Legacy username path: try forUsername
    const legacy = await tryWithKeys(key => `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(source)}&key=${key}`);
    if (legacy && legacy.items && legacy.items.length){
      return legacy.items[0].id;
    }
    // Fallback: search by query
    const search = await tryWithKeys(key => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(source)}&maxResults=1&key=${key}`);
    if (search && search.items && search.items.length){
      return search.items[0].snippet && search.items[0].snippet.channelId || search.items[0].id && search.items[0].id.channelId || null;
    }
    return null;
  }

  function setLastUpdated(){
    if (toolbar && lastUpdatedEl){
      toolbar.style.display = 'flex';
      lastUpdatedEl.innerHTML = `<i class="far fa-clock"></i> Last updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  function clearGrid(){
    if (liveGrid){
      while (liveGrid.firstChild) liveGrid.removeChild(liveGrid.firstChild);
    }
  }

  function hideAllStates(){
    if (emptyState) emptyState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
  }

  function renderLives(items){
    clearGrid();
    hideAllStates();
    if (!items || items.length === 0){
      emptyState.style.display = 'block';
      setLastUpdated();
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    items.forEach(item => {
      const vid = item.id.videoId;
      const sn = item.snippet;
      const card = document.createElement('div');
      card.className = 'live-card';
      card.innerHTML = `
        <div class="live-thumb">
          <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener">
            <img src="${sn.thumbnails && (sn.thumbnails.high?.url || sn.thumbnails.medium?.url || sn.thumbnails.default?.url) || ''}" alt="${sn.title}"/>
            <span class="live-badge"><i class="fas fa-signal"></i> LIVE</span>
          </a>
        </div>
        <div class="live-content">
          <h3 class="live-title">${sn.title}</h3>
          <div class="live-meta"><i class="far fa-clock"></i> ${new Date(sn.publishedAt).toLocaleString()}</div>
        </div>
      `;
      liveGrid.appendChild(card);
    });
  }

  function clearPast(){
    if (pastGrid){
      while (pastGrid.firstChild) pastGrid.removeChild(pastGrid.firstChild);
    }
  }

  function renderPast(items){
    clearPast();
    if (!items || items.length === 0){
      if (noPastEl) noPastEl.style.display = 'block';
      return;
    }
    if (noPastEl) noPastEl.style.display = 'none';
    items.forEach(item => {
      const vid = item.id.videoId || (item.id && item.id.videoId) || '';
      const sn = item.snippet;
      const card = document.createElement('div');
      card.className = 'live-card';
      card.innerHTML = `
        <div class="live-thumb">
          <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener">
            <img src="${sn.thumbnails && (sn.thumbnails.high?.url || sn.thumbnails.medium?.url || sn.thumbnails.default?.url) || ''}" alt="${sn.title}"/>
          </a>
        </div>
        <div class="live-content">
          <h3 class="live-title">${sn.title}</h3>
          <div class="live-meta"><i class="far fa-clock"></i> ${new Date(sn.publishedAt).toLocaleString()}</div>
        </div>
      `;
      pastGrid.appendChild(card);
    });
  }

  async function loadLives(){
    try {
      if (loadingEl) loadingEl.style.display = 'block';
      if (emptyState) emptyState.style.display = 'none';
      if (errorState) errorState.style.display = 'none';
      // Resolve sources to channel IDs first
      const channelIds = [];
      for (const src of CHANNEL_SOURCES){
        const id = await resolveChannelId(src);
        if (id && !channelIds.includes(id)) channelIds.push(id);
      }
      const allLives = [];
      for (const ch of channelIds){
        const items = await fetchLiveForChannel(ch);
        allLives.push(...items);
      }
      renderLives(allLives);
      setLastUpdated();
    } catch(e){
      clearGrid();
      hideAllStates();
      if (errorState) errorState.style.display = 'block';
      setLastUpdated();
    }
    finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }

  async function loadPast(){
    try {
      if (pastLoadingEl) pastLoadingEl.style.display = 'block';
      if (noPastEl) noPastEl.style.display = 'none';
      const channelIds = [];
      for (const src of CHANNEL_SOURCES){
        const id = await resolveChannelId(src);
        if (id && !channelIds.includes(id)) channelIds.push(id);
      }
      const all = [];
      for (const ch of channelIds){
        const data = await tryWithKeys(key => `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ch}&eventType=completed&type=video&order=date&maxResults=12&key=${key}`);
        if (data && data.items) all.push(...data.items);
      }
      renderPast(all);
    } catch(e){
      clearPast();
      if (noPastEl) noPastEl.style.display = 'block';
    } finally {
      if (pastLoadingEl) pastLoadingEl.style.display = 'none';
    }
  }

  if (refreshBtn){
    refreshBtn.addEventListener('click', loadLives);
  }

  // Initial load and periodic refresh
  loadLives();
  loadPast();
  // Refresh every 60 seconds
  setInterval(loadLives, 60000);
})();


