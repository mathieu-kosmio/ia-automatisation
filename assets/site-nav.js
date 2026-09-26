// Menu principal commun : burger et sous-menu « Outils ».
(function () {
  var nav = document.getElementById('nav-primary');
  var toggle = document.querySelector('.nav-toggle');
  if (!nav) return;
  var dds = Array.prototype.slice.call(nav.querySelectorAll('.nav-dd__btn'));
  var desktop = window.matchMedia('(min-width:1180px)');

  function closeDropdowns(except) {
    dds.forEach(function (b) { if (b !== except) b.setAttribute('aria-expanded', 'false'); });
  }
  function setMenu(open) {
    if (!toggle) return;
    nav.classList.toggle('primary--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeDropdowns();
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('primary--open'));
    });
  }

  dds.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') !== 'true';
      closeDropdowns(btn);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Un lien suivi referme tout (utile pour les ancres de la page courante).
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); closeDropdowns(); });
  });

  // Clic à l'extérieur : ferme le sous-menu, et le burger s'il est ouvert.
  document.addEventListener('click', function (e) {
    if (nav.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    closeDropdowns();
    if (nav.classList.contains('primary--open')) setMenu(false);
  });

  // Échap : ferme et rend le focus au bouton concerné.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openDd = dds.filter(function (b) { return b.getAttribute('aria-expanded') === 'true'; })[0];
    if (openDd) { closeDropdowns(); openDd.focus(); return; }
    if (nav.classList.contains('primary--open')) { setMenu(false); toggle.focus(); }
  });

  // Sur ordinateur, le sous-menu se referme quand le focus quitte le groupe.
  nav.querySelectorAll('.nav-dd').forEach(function (dd) {
    dd.addEventListener('focusout', function (e) {
      if (desktop.matches && !dd.contains(e.relatedTarget)) closeDropdowns();
    });
  });

  // Passage en largeur ordinateur : on range le burger.
  var onChange = function () { if (desktop.matches) setMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else if (desktop.addListener) desktop.addListener(onChange);
})();
