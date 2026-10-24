import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Heart, Sprout } from "lucide-react";
import TarotCard from "../components/TarotCard";
import NotFound from "./NotFound";
import { CARDS, getCardBySlug } from "../data/cards";
import { CATEGORIES } from "../data/categories";

export default function CardDetail() {
  const { slug } = useParams();
  const card = getCardBySlug(slug);
  if (!card) return <NotFound />;

  const index = CARDS.indexOf(card);
  const prev = CARDS[(index + CARDS.length - 1) % CARDS.length];
  const next = CARDS[(index + 1) % CARDS.length];

  const themes = CATEGORIES.filter((c) => card.themes.includes(c.slug));
  const related = CARDS.filter((c) => c.id !== card.id && c.themes.some((t) => card.themes.includes(t))).slice(0, 5);

  const uses = [
    { Icon: Heart, label: "IN LOVE", text: card.love },
    { Icon: Briefcase, label: "IN CAREER", text: card.career },
    { Icon: Sprout, label: "FOR PERSONAL GROWTH", text: card.growth },
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
          <div className="detail-card-caption">{card.numeral}</div>
        </div>

        <article className="detail-content">
          <span className="eyebrow">MAJOR ARCANA · {card.numeral}</span>
          <h1>
            {card.numeral} — {card.name}
          </h1>
          <p className="sub">{card.keywords.join(" · ")}</p>

          <div className="meaning">
            <h5>THE MEANING</h5>
            <p>{card.meaning}</p>
          </div>

          <div className="cols">
            <div>
              <h5>UPRIGHT</h5>
              <ul>
                {card.upright.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5>REVERSED</h5>
              <ul>
                {card.reversed.map((word) => (
                  <li key={word}>{word}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tags">
            {card.keywords.map((word) => (
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

          <div className="note">“{card.quote}”</div>

          {themes.length > 0 && (
            <div className="appears-in">
              <h5>APPEARS IN</h5>
              <div className="chips">
                {themes.map(({ slug: themeSlug, title, Icon }) => (
                  <Link key={themeSlug} className="chip chip-icon" to={`/explore/${themeSlug}`}>
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
                <Link key={c.id} className="strip-card" to={`/cards/${c.slug}`}>
                  <TarotCard card={c} />
                  <span className="strip-name">{c.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="pager">
          <Link to={`/cards/${prev.slug}`}>
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>PREVIOUS</small>
              {prev.numeral} · {prev.name}
            </span>
          </Link>
          <Link to={`/cards/${next.slug}`} className="pager-next">
            <span>
              <small>NEXT</small>
              {next.numeral} · {next.name}
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
