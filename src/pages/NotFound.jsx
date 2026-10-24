import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page notfound">
      <span className="notfound-glyph" aria-hidden="true">☾</span>
      <span className="eyebrow">LOST IN THE DARK</span>
      <h1>This card has wandered off.</h1>
      <p>The page you were looking for isn’t in the deck.</p>
      <Link className="btn" to="/">
        <ArrowLeft aria-hidden="true" /> Back home
      </Link>
    </div>
  );
}
