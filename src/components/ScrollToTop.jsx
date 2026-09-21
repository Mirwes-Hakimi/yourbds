import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on route changes by
// default (unlike a traditional multi-page site, where every new page
// load starts at the top). Without this, clicking any link or package
// button while scrolled down leaves you at the same scroll position on the
// new page instead of starting at the top.
//
// IMPORTANT: on this site the <body> element is the scrolling container, not
// the browser window (see html/body in src/index.css: body has its own
// overflow-y). window.scrollTo() alone therefore does nothing, so we reset the
// body and root elements too. Keep all three if index.css ever changes.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null; // renders nothing — only has the side effect above
}
