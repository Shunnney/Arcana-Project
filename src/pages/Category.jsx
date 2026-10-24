import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TarotCard from "../components/TarotCard";
import SectionHeading from "../components/SectionHeading";
import NotFound from "./NotFound";
import { CARDS } from "../data/cards";
import { CATEGORIES, getCategory } from "../data/categories";

export default function Category() {
  const { slug } = useParams();
  const category = getCategory(slug);
  if (!category) return <NotFound />;

  const { title, tagline, tone, Icon, intro, questions, field } = category;
  const cards = CARDS.filter((c) => c.themes.includes(slug));
  const others = CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <div className="page">
      <section className={`cat-hero tone-${tone}`}>
        <div className="page-wrap">
          <span className="cat-badge">
            <Icon aria-hidden="true" />
          </span>
          <span className="eyebrow">EXPLORE · {cards.length} CARDS</span>
          <h1>{title}</h1>
          <p className="cat-tagline">{tagline}</p>
          <p className="cat-intro">{intro}</p>
        </div>
      </section>

      <div className="page-wrap cat-body">
        <section>
          <SectionHeading eyebrow="REFLECT" title="Questions to sit with" />
          <ul className="prompt-list">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading eyebrow="THE CARDS" title={`Cards for ${title}`} />
          <div className="cat-list">
            {cards.map((card) => (
              <Link key={card.id} className="cat-item" to={`/cards/${card.slug}`}>
                <TarotCard card={card} />
                <div>
                  <span className="eyebrow">{card.numeral}</span>
                  <h3>{card.name}</h3>
                  <p>{card[field]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="cat-cta">
          <p>Ready to see what the deck says about this?</p>
          <Link className="btn" to="/reading">
            Begin a reading <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section>
          <SectionHeading eyebrow="KEEP EXPLORING" title="Other themes" />
          <div className="chips">
            {others.map(({ slug: otherSlug, title: otherTitle, Icon: OtherIcon }) => (
              <Link key={otherSlug} className="chip chip-icon" to={`/explore/${otherSlug}`}>
                <OtherIcon aria-hidden="true" /> {otherTitle}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
