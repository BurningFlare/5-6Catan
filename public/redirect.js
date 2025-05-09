// Handles redirects for SPA on GitHub Pages
(function() {
  const redirectFromGitHubPages = () => {
    const p = window.location.search.match(/[?&]p=([^&]+)/);
    const q = window.location.search.match(/[?&]q=([^&]+)/);
    const h = window.location.hash;
    
    if (p) {
      let newPath = p[1];
      let newSearch = q ? '?' + q[1] : '';
      let newUrl = window.location.origin + window.location.pathname.split('?')[0] + newSearch + h;
      
      // Only replace if we need to (prevents infinite loops)
      if (window.location.toString() !== newUrl) {
        window.history.replaceState(null, null, newUrl);
      }
    }
  };
  
  // Run once on page load
  redirectFromGitHubPages();
})(); 