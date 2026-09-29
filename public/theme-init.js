// Applies the stored or system theme before first paint, so dark-mode visitors never see a light flash.
// Loaded as an external file because the CSP (script-src 'self') blocks inline scripts.
(function () {
  var mode = null;
  try {
    mode = localStorage.getItem('kopwerk_theme_preference');
  } catch (e) {
    // Storage can be blocked (private mode, sandboxed frames); fall back to the system preference.
  }
  var dark = mode === 'dark' || (mode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var root = document.documentElement;
  root.classList.add(dark ? 'dark' : 'light');
  root.style.colorScheme = dark ? 'dark' : 'light';
})();
