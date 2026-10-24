import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import useLocalStorage from "../hooks/useLocalStorage";

const MOBILE_QUERY = "(max-width: 850px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export default function Layout() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  // Desktop remembers your choice; mobile always starts closed.
  const [desktopOpen, setDesktopOpen] = useLocalStorage("arcana-sidebar", true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage("arcana-theme", "light");

  const open = isMobile ? mobileOpen : desktopOpen;
  const setOpen = (value) => (isMobile ? setMobileOpen(value) : setDesktopOpen(value));

  // apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // new page → close the mobile drawer and jump to the top
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, mobileOpen]);

  return (
    <div className={`shell ${open ? "is-open" : "is-closed"}`}>
      <Header
        open={open}
        isMobile={isMobile}
        onToggle={() => setOpen(!open)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <Sidebar open={open} isMobile={isMobile} onHide={() => setOpen(false)} />

      {isMobile && open && (
        <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <div className="shell-body">
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
