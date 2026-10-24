import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, Compass, Layers, MoonStar, Orbit, Shuffle, Sparkles,
} from "lucide-react";
import TarotCard from "../components/TarotCard";
import SectionHeading from "../components/SectionHeading";
import SpreadPreview from "../components/SpreadPreview";
import { CARDS, STAGES, getCardOfTheDay, inStage } from "../data/cards";
import { CATEGORIES } from "../data/categories";
import { SPREADS } from "../data/spreads";

const STARS = [
  { t: "14%", l: "9%", s: 14, d: "0s" },
  { t: "28%", l: "22%", s: 9, d: "1.2s" },
  { t: "12%", l: "38%", s: 11, d: "2.1s" },
  { t: "34%", l: "58%", s: 8, d: "0.6s" },
  { t: "16%", l: "70%", s: 13, d: "1.8s" },
  { t: "46%", l: "84%", s: 9, d: "2.6s" },
  { t: "58%", l: "12%", s: 8, d: "1.5s" },
  { t: "62%", l: "46%", s: 10, d: "0.3s" },
];

const STATS = [
  { Icon: Layers, value: "22", label: "Major Arcana cards" },
  { Icon: Shuffle, value: "3", label: "Reading spreads" },
  { Icon: Compass, value: "5", label: "Themes to explore" },
  { Icon: Sparkles, value: "∞", label: "Stories to tell" },
];

const ABOUT_LINKS = [
  {
    to: "/about/tarot", Icon: BookOpen, title: "What is Tarot?",
    text: "A gentle introduction to the deck, its history, and how to read a card as a tool for reflection.",
  },
  {
    to: "/about/major-arcana", Icon: Orbit, title: "About the Major Arcana",
    text: "Meet the 22 archetypes and follow the Fool’s Journey from first step to completion.",
  },
];

export default function Home() {
  const today = getCardOfTheDay();
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="page">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-stars" aria-hidden="true">
          {STARS.map((star, i) => (
            <span key={i} style={{ top: star.t, left: star.l, fontSize: star.s, animationDelay: star.d }}>
              ✦
            </span>
          ))}
        </div>
        <div className="moon" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-small">Welcome to</p>
          <h1>ARCANA</h1>
          <p className="hero-subtitle">The Major Arcana Archive</p>
          <div className="hero-divider">✦</div>
          <blockquote>
            “The cards do not tell your future.
            <br />
            They tell a story.”
          </blockquote>

          <div className="hero-actions">
            <Link className="btn btn-gold" to="/reading">
              <MoonStar aria-hidden="true" /> Begin a reading
            </Link>
            <Link className="btn btn-ghost" to="/cards">
              <Layers aria-hidden="true" /> Browse the deck
            </Link>
          </div>
        </div>

        <div className="hero-landscape" aria-hidden="true">
          <span className="tower tower-one" />
          <span className="tower tower-two" />
          <span className="tower tower-three" />
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <div className="home-content stats-wrap">
        <div className="stats">
          {STATS.map(({ Icon, value, label }) => (
            <div className="stat" key={label}>
              <Icon aria-hidden="true" />
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-content">
        {/* ---------- QUICK PATHS (Explore menu) ---------- */}
        <section className="home-block">
          <SectionHeading eyebrow="EXPLORE BY THEME" title="What are you looking for today?" />

          <div className="tiles">
            {CATEGORIES.map(({ slug, title, tagline, tone, Icon }) => (
              <Link key={slug} className={`tile tile-${tone}`} to={`/explore/${slug}`}>
                <span className="tile-icon">
                  <Icon aria-hidden="true" />
                </span>
                <b>{title}</b>
                <span className="tile-sub">{tagline}</span>
                <span className="tile-count">
                  {CARDS.filter((c) => c.themes.includes(slug)).length} cards
                </span>
              </Link>
            ))}

            <Link className="tile tile-sage" to="/reading">
              <span className="tile-icon">
                <MoonStar aria-hidden="true" />
              </span>
              <b>A Simple Reading</b>
              <span className="tile-sub">Draw a card</span>
              <span className="tile-count">3 spreads</span>
            </Link>
          </div>
        </section>

        {/* ---------- CARD OF THE DAY ---------- */}
        <section className="home-block">
          <SectionHeading eyebrow="TODAY" title="Card of the Day" Icon={Sparkles} />

          <div className="cotd">
            <div className="cotd-card">
              <TarotCard card={today} />
            </div>

            <div className="cotd-info">
              <span className="eyebrow">{dateLabel}</span>
              <h3>
                {today.numeral} — {today.name}
              </h3>
              <p className="sub">{today.keywords.join(" · ")}</p>
              <p className="cotd-text">{today.meaning}</p>

              <div className="tags">
                {today.upright.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>

              <div className="cotd-actions">
                <Link className="btn" to={`/cards/${today.slug}`}>
                  Explore <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="btn btn-outline" to="/reading?spread=one">
                  Draw your own
                </Link>
              </div>
            </div>

            <div className="quote">“{today.quote}”</div>
          </div>
        </section>

        {/* ---------- READING SPREADS ---------- */}
        <section className="home-block">
          <SectionHeading
            eyebrow="THE READING ROOM"
            title="Begin a Reading"
            Icon={MoonStar}
            action={
              <Link className="link-arrow" to="/reading">
                Open reading room <ArrowRight aria-hidden="true" />
              </Link>
            }
          />

          <div className="spread-grid compact">
            {SPREADS.map((spread) => (
              <Link key={spread.id} className="spread-card" to={`/reading?spread=${spread.id}`}>
                <SpreadPreview spread={spread} />
                <div className="spread-info">
                  <h3>{spread.title}</h3>
                  <p>{spread.subtitle}</p>
                  <small>{spread.description}</small>
                </div>
                <span className="spread-number">{spread.number}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- THE FOOL'S JOURNEY ---------- */}
        <section className="home-block">
          <SectionHeading
            eyebrow="THE FOOL’S JOURNEY"
            title="Three Acts, Twenty-Two Cards"
            Icon={Compass}
          />

          <div className="journey">
            {STAGES.map((stage) => (
              <Link key={stage.id} className="journey-step" to={`/cards?stage=${stage.id}`}>
                <span className="journey-num">{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.blurb}</p>

                <div className="journey-thumbs">
                  {CARDS.filter((c) => inStage(c, stage.id))
                    .slice(0, 4)
                    .map((card) => (
                      <span className="thumb" key={card.id}>
                        <TarotCard card={card} />
                      </span>
                    ))}
                </div>

                <span className="link-arrow">
                  Explore {stage.label} <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- DECK STRIP ---------- */}
        <section className="home-block">
          <SectionHeading
            eyebrow="THE DECK"
            title="All 22 Cards"
            Icon={Layers}
            action={
              <Link className="link-arrow" to="/cards">
                View all cards <ArrowRight aria-hidden="true" />
              </Link>
            }
          />

          <div className="deck-strip">
            {CARDS.map((card) => (
              <Link key={card.id} className="strip-card" to={`/cards/${card.slug}`}>
                <TarotCard card={card} />
                <span className="strip-name">{card.name}</span>
                <small>{card.numeral}</small>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- ABOUT ---------- */}
        <section className="home-block">
          <SectionHeading eyebrow="LEARN" title="New to Tarot?" Icon={BookOpen} />

          <div className="about-grid">
            {ABOUT_LINKS.map(({ to, Icon, title, text }) => (
              <Link key={to} className="about-card" to={to}>
                <span className="about-icon">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="link-arrow">
                    Read more <ArrowRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ---------- CLOSING ---------- */}
      <section className="closing">
        <Sparkles aria-hidden="true" />
        <blockquote>“Not everything that is lost is gone forever.”</blockquote>
        <cite>— The Star · XVII</cite>
      </section>
    </div>
  );
}
