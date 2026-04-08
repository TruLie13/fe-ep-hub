/** Restore content font scale on <html> before paint to avoid text jump. */
export const CONTENT_FONT_SCALE_INIT_SCRIPT_INNER =
  "(function(){try{var key='eptruth-content-font-scale';var raw=localStorage.getItem(key);var allowed={'1':1,'1.125':1,'1.25':1,'1.375':1};var value=allowed[raw]?raw:'1';document.documentElement.style.setProperty('--eptruth-content-font-scale',value);}catch(e){}})();";
