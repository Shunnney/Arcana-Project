import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Heart, Sprout } from "lucide-react";
import TarotCard from "../components/TarotCard";
import NotFound from "./NotFound";
import { CATEGORIES } from "../data/categories";
import { useTarot } from "../context/TarotContext";

export default function CardDetail() {
  const { slug } = useParams();
  const { cards, getCardBySlug } = useTarot();
  const card = getCardBySlug(slug);
  if (!card) return <NotFound />;

  const index = cards.findIndex((c) => c.id === card.id);
  const prev = cards[(index + cards.length - 1) % cards.length];
  const next = cards[(index + 1) % cards.length];

  const cardThemes = Array.isArray(card.themes) ? card.themes : [];
  const themes = CATEGORIES.filter((c) => cardThemes.includes(c.slug));
  const related = cards
    .filter(
      (c) =>
        c.id !== card.id &&
        Array.isArray(c.themes) &&
        c.themes.some((t) => cardThemes.includes(t))
    )
    .slice(0, 5);

  const keywords = Array.isArray(card.keywords)
    ? card.keywords
    : typeof card.keywords === "string"
    ? card.keywords.split(",").map((k) => k.trim())
    : [];

  const upright = Array.isArray(card.upright)
    ? card.upright
    : typeof card.uprightMeaning === "string"
    ? card.uprightMeaning.split(",").map((s) => s.trim())
    : [];

  const reversed = Array.isArray(card.reversed)
    ? card.reversed
    : typeof card.reversedMeaning === "string"
    ? card.reversedMeaning.split(",").map((s) => s.trim())
    : [];

  const uses = [
    {
      Icon: Heart,
      label: "IN LOVE",
      text: card.love || card.uprightMeaning || "Deep connection and honesty.",
    },
    {
      Icon: Briefcase,
      label: "IN CAREER",
      text:
        card.career ||
        card.uprightMeaning ||
        "Professional development and focus.",
    },
    {
      Icon: Sprout,
      label: "FOR PERSONAL GROWTH",
      text:
        card.growth ||
        card.description ||
        "Inner wisdom and mindful reflection.",
    },
  ];

  return (
    <div className="page">
      <Link className="back" to="/cards">
        <ArrowLeft aria-hidden="true" /> Back to All Cards
      </Link>

      <div className="detail">
        <div className="detail-card">
          <div className="large-card">
            <TarotCard card={card} />
          </div>
          <div className="detail-card-caption">
            {card.numeral || card.number}
          </div>
        </div>

        <article className="detail-content">
          <span className="eyebrow">
            {card.arcana || "MAJOR ARCANA"} · {card.numeral || card.number}
          </span>
          <h1>
            {card.numeral || card.number} — {card.name}
          </h1>
          <p className="sub">{keywords.join(" · ")}</p>

          <div className="meaning">
            <h5>THE MEANING</h5>
            <p>{card.description || card.meaning || card.summary}</p>
          </div>

          {(card.element || card.planet || card.zodiac) && (
            <div className="meaning" style={{ marginTop: "16px" }}>
              <h5>ESOTERIC CORRESPONDENCES</h5>
              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {card.element && <span><strong>Element:</strong> {card.element} &nbsp;·&nbsp; </span>}
                {card.planet && <span><strong>Planet:</strong> {card.planet} &nbsp;·&nbsp; </span>}
                {card.zodiac && <span><strong>Zodiac:</strong> {card.zodiac}</span>}
              </p>
            </div>
          )}

          {card.symbolism && (
            <div className="meaning" style={{ marginTop: "16px" }}>
              <h5>SYMBOLISM</h5>
              <p>{card.symbolism}</p>
            </div>
          )}

          <div className="cols">
            <div>
              <h5>UPRIGHT</h5>
              <ul>
                {upright.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5>REVERSED</h5>
              <ul>
                {reversed.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tags">
            {keywords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>

          {uses.map(({ Icon, label, text }) => (
            <div className="use" key={label}>
              <i>
                <Icon aria-hidden="true" />
              </i>
              <div>
                <h5>{label}</h5>
                <p>{text}</p>
              </div>
            </div>
          ))}

          {card.quote && <div className="note">“{card.quote}”</div>}

          {themes.length > 0 && (
            <div className="appears-in">
              <h5>APPEARS IN</h5>
              <div className="chips">
                {themes.map(({ slug: themeSlug, title, Icon }) => (
                  <Link
                    key={themeSlug}
                    className="chip chip-icon"
                    to={`/explore/${themeSlug}`}
                  >
                    <Icon aria-hidden="true" /> {title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* related + previous / next */}
      <div className="detail-more">
        {related.length > 0 && (
          <>
            <h5>RELATED CARDS</h5>
            <div className="related">
              {related.map((c) => (
                <Link
                  key={c.id}
                  className="strip-card"
                  to={`/cards/${c.slug || c.id}`}
                >
                  <TarotCard card={c} />
                  <span className="strip-name">{c.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="pager">
          <Link to={`/cards/${prev.slug || prev.id}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>PREVIOUS</small>
              {prev.numeral || prev.number} · {prev.name}
            </span>
          </Link>
          <Link to={`/cards/${next.slug || next.id}`} className="pager-next">
            <span>
              <small>NEXT</small>
              {next.numeral || next.number} · {next.name}
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
