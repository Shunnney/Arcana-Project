import { Link, NavLink } from "react-router-dom";
import { PanelLeftClose } from "lucide-react";
import { NAV } from "../data/navigation";
import { getCardOfTheDay } from "../data/cards";

export default function Sidebar({ open, isMobile, onHide }) {
  const today = getCardOfTheDay();

  return (
    <nav id="sidebar" className="side" aria-label="Main navigation" aria-hidden={!open}>
      {NAV.map((section) => (
        <div className="nav-section" key={section.heading}>
          <h4>{section.heading}</h4>

          {section.items.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <div className="side-foot">
        <Link to={`/cards/${today.slug}`} className="side-daily">
          <small>TODAY’S CARD</small>
          <b>
            {today.numeral} · {today.name}
          </b>
        </Link>

        {!isMobile && (
          <button type="button" className="side-hide" onClick={onHide}>
            <PanelLeftClose aria-hidden="true" />
            Hide menu
          </button>
        )}
      </div>
    </nav>
  );
}
