(() => {
  'use strict';
  const track = document.querySelector('.screen-track');
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const links = document.querySelectorAll('[data-screen]');
  const mobile = window.matchMedia('(max-width: 760px)');
  if (!track || !panels.length) return;
  let frame = 0;
  function sync() {
    frame = 0;
    const edge = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
    const nearest = panels.reduce((a,b) => Math.abs(a.getBoundingClientRect().left-edge) <= Math.abs(b.getBoundingClientRect().left-edge) ? a : b);
    links.forEach(link => {
      if (link.dataset.screen === nearest.dataset.panel) link.setAttribute('aria-current','true');
      else link.removeAttribute('aria-current');
    });
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (!mobile.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = panels.find(panel => panel.dataset.panel === link.dataset.screen);
    const left = target.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-parseFloat(getComputedStyle(track).paddingLeft);
    track.scrollTo({left,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }));
  track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync);},{passive:true});
  window.addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(sync);});
  sync();
})();
