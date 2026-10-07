// Applies the theme before first paint, so nobody sees a flash of the other one.
// Dark first, the person decides (design system, Themes): a choice made with the toggle wins; otherwise a system
// setting for light wins; otherwise dark. The markup already starts dark, so without this script the page is dark too.
// Loaded as an external file because the CSP (script-src 'self') blocks inline scripts.
(function () {
  var mode = null;
  try {
    mode = localStorage.getItem('kopwerk_theme_preference');
  } catch (e) {
    // Storage can be blocked (private mode, sandboxed frames); fall back to the system preference.
  }
  var light = mode === 'light' || (mode !== 'dark' && window.matchMedia('(prefers-color-scheme: light)').matches);
  var root = document.documentElement;
  root.classList.toggle('dark', !light);
  root.classList.toggle('light', light);
  root.style.colorScheme = light ? 'light' : 'dark';
})();
