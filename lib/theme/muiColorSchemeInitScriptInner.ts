/** Inline body: always apply dark color scheme on <html> before paint (matches CssVarsProvider defaultMode="dark", storage disabled). */
export const MUI_COLOR_SCHEME_INIT_SCRIPT_INNER =
  "(function(){try{var light='light',dark='dark';document.documentElement.classList.remove(light,dark);document.documentElement.classList.add(dark);}catch(e){}})();";
