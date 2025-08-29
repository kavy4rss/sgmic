// Universal header loader: swaps desktop header and hamburger header based on device/viewport
(function(){
  const MOBILE_MAX_WIDTH = 900;
  const HAMBURGER_CSS_ID = 'hamburger-menu-css';
  const HAMBURGER_JS_ID = 'hamburger-menu-js';

  function isMobileView(){
    const byWidth = window.innerWidth <= MOBILE_MAX_WIDTH;
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const byUA = /android|iphone|ipad|ipod|iemobile|mobile/i.test(ua);
    return byWidth || byUA;
  }

  function ensureHeaderContainer(){
    let el = document.getElementById('header-container');
    if (!el){
      el = document.createElement('div');
      el.id = 'header-container';
      document.body.insertBefore(el, document.body.firstChild);
    }
    return el;
  }

  function loadCSSOnce(href, id){
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.id = id;
    document.head.appendChild(link);
  }

  function removeElById(id){
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  async function fetchText(url){
    const res = await fetch(url);
    return res.text();
  }

  let currentMode = null; // 'mobile' | 'desktop'

  async function applyHeader(){
    const container = ensureHeaderContainer();
    const wantMobile = isMobileView();
    const nextMode = wantMobile ? 'mobile' : 'desktop';

    if (container.getAttribute('data-header-type') === nextMode){
      return; // already correct
    }

    try {
      if (wantMobile){
        let html = await fetchText(resolvePath('Header/hamburger-header.html'));
        html = rewriteRelativeUrlsForSubpages(html);
        container.innerHTML = html;
        container.setAttribute('data-header-type','mobile');
        // Ensure hamburger CSS/JS present
        loadCSSOnce(resolvePath('css/hamburger-menu.css'), HAMBURGER_CSS_ID);
        // Load new mobile menu script only once
        if (!document.getElementById('mobile-menu-js')){
          const sc = document.createElement('script');
          sc.src = resolvePath('Header/mobile-menu.js');
          sc.id = 'mobile-menu-js';
          document.body.appendChild(sc);
        }
        // remove desktop header js if present
        const dh = document.getElementById('desktop-header-js');
        if (dh) dh.remove();
        // safety: clear body overflow if stuck
        const menu = document.getElementById('mobileNavMenu');
        if (!menu || !menu.classList.contains('open')) {
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';
        }
      } else {
        let html = await fetchText(resolvePath('Header/header.html'));
        html = rewriteRelativeUrlsForSubpages(html);
        container.innerHTML = html;
        container.setAttribute('data-header-type','desktop');
        // Remove hamburger assets if present
        removeElById(HAMBURGER_CSS_ID);
        removeElById('mobile-menu-js');
        // load desktop header behavior if exists
        if (!document.getElementById('desktop-header-js')){
          const sc = document.createElement('script');
          sc.src = resolvePath('Header/header.js');
          sc.id = 'desktop-header-js';
          document.body.appendChild(sc);
        }
        // safety: ensure scrolling enabled on desktop
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    } catch(e){
      console.error('Header load error:', e);
    }
  }

  // Resolve relative path whether page is at root or in /pages/
  function resolvePath(rel){
    // If this page sits under /pages/, prepend ../
    const path = window.location.pathname;
    const underPages = /\/pages\//.test(path);
    return underPages ? ('../' + rel) : rel;
  }

  // For content injected into subpages, fix relative src/href so they point out of /pages/
  function rewriteRelativeUrlsForSubpages(html){
    const path = window.location.pathname;
    const underPages = /\/pages\//.test(path);
    if (!underPages) return html;
    // Prefix ../ to relative src/href that do not already start with ../, /, protocol, or special schemes
    // Double-quoted attributes
    html = html.replace(/\b(src|href)="(?!https?:|mailto:|tel:|#|\/\/|javascript:|\/|\.\.\/)([^"]+)"/gi, function(_, attr, url){
      return attr + '="../' + url + '"';
    });
    // Single-quoted attributes
    html = html.replace(/\b(src|href)='(?!https?:|mailto:|tel:|#|\/\/|javascript:|\/|\.\.\/)([^']+)'/gi, function(_, attr, url){
      return attr + "='../" + url + "'";
    });
    return html;
  }

  function debounce(fn, delay){
    let t; return function(){
      clearTimeout(t); t = setTimeout(fn, delay);
    };
  }

  document.addEventListener('DOMContentLoaded', applyHeader);
  window.addEventListener('resize', debounce(applyHeader, 200));
})();


