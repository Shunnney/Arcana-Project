import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, X } from "lucide-react";

export default function Header({ open, isMobile, onToggle, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");

  // keep the box in sync with ?q= (and clear it on other pages)
  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const submit = (e) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/cards?q=${encodeURIComponent(term)}` : "/cards");
  };

  let ToggleIcon;
  if (isMobile) ToggleIcon = open ? X : Menu;
  else ToggleIcon = open ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="top">
      <button
        type="button"
        className="icon-btn menu-btn"
        onClick={onToggle}
        aria-label={open ? "Hide menu" : "Show menu"}
        aria-expanded={open}
        aria-controls="sidebar"
        title={open ? "Hide menu" : "Show menu"}
      >
        <ToggleIcon />
      </button>

      <Link to="/" className="logo" aria-label="Arcana — home">
        ARCANA
        <small>The Major Arcana Archive</small>
      </Link>

      <form className="search" role="search" onSubmit={submit}>
        <Search aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a card, theme..."
          aria-label="Search cards"
        />
      </form>

      <button
        type="button"
        className="icon-btn"
        onClick={onToggleTheme}
        aria-label={theme === "light" ? "Switch to night mode" : "Switch to day mode"}
        title={theme === "light" ? "Night mode" : "Day mode"}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </header>
  );
}
