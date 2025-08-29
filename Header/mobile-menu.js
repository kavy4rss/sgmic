// Clean multi-depth mobile menu controller (no inline/emergency code required)
(function(){
  function qs(s){return document.querySelector(s);} 
  function qsa(s){return Array.from(document.querySelectorAll(s));}

  function init(){
    const root = qs('.mobile-header');
    if (!root) return;
    const toggle = qs('#hamburgerToggle');
    const menu = qs('#mobileNavMenu');
    // Use existing overlay if present; otherwise create one
    let overlay = qs('#menuOverlay') || qs('.menu-overlay');
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className='menu-overlay';
      overlay.id='menuOverlay';
      root.querySelector('.navbar').appendChild(overlay);
    } else if (!overlay.id) {
      overlay.id = 'menuOverlay';
    }
    if (!toggle || !menu) return;

    const openMenu = ()=>{
      menu.classList.add('open');
      toggle.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded','true');
      menu.setAttribute('aria-hidden','false');
    };
    const closeMenu = ()=>{
      menu.classList.remove('open');
      toggle.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-hidden','true');
      // collapse all submenus
      qsa('#mobileNavMenu .has-children.active').forEach(li=>li.classList.remove('active'));
    };
    const toggleMenu = (e)=>{ if(e){e.preventDefault(); e.stopPropagation();} menu.classList.contains('open')?closeMenu():openMenu(); };

    // Bindings
    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
    document.addEventListener('click', (e)=>{ if(!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) closeMenu(); });
    window.addEventListener('resize', ()=>{ if (window.innerWidth>900) closeMenu(); });

    // Multi-depth submenu handling (support old `.has-dropdown` too)
    qsa('#mobileNavMenu .has-children > a, #mobileNavMenu .has-dropdown > a').forEach(link=>{
      link.addEventListener('click', (e)=>{
        e.preventDefault(); e.stopPropagation();
        const li = link.parentElement;
        // close siblings only at same depth
        qsa(':scope > li.has-children, :scope > li.has-dropdown', li.parentElement).forEach(sib=>{ if(sib!==li) sib.classList.remove('active'); });
        li.classList.toggle('active');
      });
    });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


