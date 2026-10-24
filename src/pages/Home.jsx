import {
  BookOpen,
  Compass,
  Layers,
  MoonStar,
  Orbit,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import TarotCard from "../components/TarotCard";
import SectionHeading from "../components/SectionHeading";
import SpreadPreview from "../components/SpreadPreview";
import {
  Arrow,
  Button,
  CardLink,
  CountUp,
  Reveal,
  Stagger,
  StaggerItem,
  TextLink,
  Tilt,
  rise,
} from "../components/Motion";
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
    to: "/about/tarot",
    Icon: BookOpen,
    title: "What is Tarot?",
    text: "A gentle introduction to the deck, its history, and how to read a card as a tool for reflection.",
  },
  {
    to: "/about/major-arcana",
    Icon: Orbit,
    title: "About the Major Arcana",
    text: "Meet the 22 archetypes and follow the Fool’s Journey from first step to completion.",
  },
];

/* hero text appears line by line */
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

export default function Home() {
  const today = getCardOfTheDay();
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-stars" aria-hidden="true">
          {STARS.map((star, i) => (
            <span
              key={i}
              style={{
                top: star.t,
                left: star.l,
                fontSize: star.s,
                animationDelay: star.d,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        <motion.div
          className="moon"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.55, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 1.6 },
            scale: { duration: 1.6, ease: "easeOut" },
            y: { duration: 7, ease: "easeInOut", repeat: Infinity },
          }}
        />

        <motion.div
          className="hero-content"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p className="hero-small" variants={rise}>
            Welcome to
          </motion.p>
          <motion.h1 variants={rise}>ARCANA</motion.h1>
          <motion.p className="hero-subtitle" variants={rise}>
            The Major Arcana Archive
          </motion.p>
          <motion.div className="hero-divider" variants={rise}>
            <motion.span
              style={{ display: "inline-block" }}
              animate={{ rotate: 360, scale: [1, 1.25, 1] }}
              transition={{
                rotate: { duration: 14, ease: "linear", repeat: Infinity },
                scale: { duration: 3, ease: "easeInOut", repeat: Infinity },
              }}
            >
              ✦
            </motion.span>
          </motion.div>
          <motion.blockquote variants={rise}>
            “The cards do not tell your future.
            <br />
            They tell a story.”
          </motion.blockquote>

          <motion.div className="hero-actions" variants={rise}>
            <Button className="btn btn-gold" to="/reading">
              <MoonStar aria-hidden="true" /> Begin a reading
            </Button>
            <Button className="btn btn-ghost" to="/cards">
              <Layers aria-hidden="true" /> Browse the deck
            </Button>
          </motion.div>
        </motion.div>

        <div className="hero-landscape" aria-hidden="true">
          <span className="tower tower-one" />
          <span className="tower tower-two" />
          <span className="tower tower-three" />
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <div className="home-content stats-wrap">
        <Stagger className="stats" gap={0.12}>
          {STATS.map(({ Icon, value, label }) => (
            <StaggerItem className="stat" key={label}>
              <Icon aria-hidden="true" />
              <CountUp value={value} />
              <span>{label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="home-content">
        {/* ---------- QUICK PATHS (Explore menu) ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="EXPLORE BY THEME"
            title="What are you looking for today?"
          />

          <Stagger className="tiles">
            {CATEGORIES.map(({ slug, title, tagline, tone, Icon }) => (
              <CardLink
                key={slug}
                className={`tile tile-${tone}`}
                to={`/explore/${slug}`}
              >
                <span className="tile-icon">
                  <Icon aria-hidden="true" />
                </span>
                <b>{title}</b>
                <span className="tile-sub">{tagline}</span>
                <span className="tile-count">
                  {CARDS.filter((c) => c.themes.includes(slug)).length} cards
                </span>
              </CardLink>
            ))}

            <CardLink className="tile tile-sage" to="/reading">
              <span className="tile-icon">
                <MoonStar aria-hidden="true" />
              </span>
              <b>A Simple Reading</b>
              <span className="tile-sub">Draw a card</span>
              <span className="tile-count">3 spreads</span>
            </CardLink>
          </Stagger>
        </Reveal>

        {/* ---------- CARD OF THE DAY ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="TODAY"
            title="Card of the Day"
            Icon={Sparkles}
          />

          <div className="cotd">
            <Tilt className="cotd-card">
              <TarotCard card={today} />
            </Tilt>

            <div className="cotd-info">
              <span className="eyebrow">{dateLabel}</span>
              <h3>
                {today.numeral} — {today.name}
              </h3>
              <p className="sub">{today.keywords.join(" · ")}</p>
              <p className="cotd-text">{today.meaning}</p>

              <Stagger className="tags" gap={0.07}>
                {today.upright.map((word) => (
                  <StaggerItem as="span" key={word}>
                    {word}
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="cotd-actions">
                <Button className="btn" to={`/cards/${today.slug}`}>
                  Explore <Arrow />
                </Button>
                <Button className="btn btn-outline" to="/reading?spread=one">
                  Draw your own
                </Button>
              </div>
            </div>

            <Reveal className="quote" delay={0.2} y={20}>
              “{today.quote}”
            </Reveal>
          </div>
        </Reveal>

        {/* ---------- READING SPREADS ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="THE READING ROOM"
            title="Begin a Reading"
            Icon={MoonStar}
            action={
              <TextLink className="link-arrow" to="/reading">
                Open reading room <Arrow />
              </TextLink>
            }
          />

          <Stagger className="spread-grid compact">
            {SPREADS.map((spread) => (
              <CardLink
                key={spread.id}
                className="spread-card"
                to={`/reading?spread=${spread.id}`}
              >
                <SpreadPreview spread={spread} />
                <div className="spread-info">
                  <h3>{spread.title}</h3>
                  <p>{spread.subtitle}</p>
                  <small>{spread.description}</small>
                </div>
                <span className="spread-number">{spread.number}</span>
              </CardLink>
            ))}
          </Stagger>
        </Reveal>

        {/* ---------- THE FOOL'S JOURNEY ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="THE FOOL’S JOURNEY"
            title="Three Acts, Twenty-Two Cards"
            Icon={Compass}
          />

          <Stagger className="journey" gap={0.15}>
            {STAGES.map((stage) => (
              <CardLink
                key={stage.id}
                className="journey-step"
                to={`/cards?stage=${stage.id}`}
              >
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
                  Explore {stage.label} <Arrow />
                </span>
              </CardLink>
            ))}
          </Stagger>
        </Reveal>

        {/* ---------- DECK STRIP ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="THE DECK"
            title="All 22 Cards"
            Icon={Layers}
            action={
              <TextLink className="link-arrow" to="/cards">
                View all cards <Arrow />
              </TextLink>
            }
          />

          <Stagger className="deck-strip" gap={0.04}>
            {CARDS.map((card) => (
              <CardLink
                key={card.id}
                className="strip-card"
                to={`/cards/${card.slug}`}
                lift={4}
              >
                <TarotCard card={card} />
                <span className="strip-name">{card.name}</span>
                <small>{card.numeral}</small>
              </CardLink>
            ))}
          </Stagger>
        </Reveal>

        {/* ---------- ABOUT ---------- */}
        <Reveal as="section" className="home-block">
          <SectionHeading
            eyebrow="LEARN"
            title="New to Tarot?"
            Icon={BookOpen}
          />

          <Stagger className="about-grid" gap={0.14}>
            {ABOUT_LINKS.map(({ to, Icon, title, text }) => (
              <CardLink key={to} className="about-card" to={to}>
                <span className="about-icon">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="link-arrow">
                    Read more <Arrow />
                  </span>
                </div>
              </CardLink>
            ))}
          </Stagger>
        </Reveal>
      </div>

      {/* ---------- CLOSING ---------- */}
      <Reveal as="section" className="closing">
        <motion.span
          style={{ display: "inline-flex" }}
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <Sparkles aria-hidden="true" />
        </motion.span>
        <blockquote>“Not everything that is lost is gone forever.”</blockquote>
        <cite>— The Star · XVII</cite>
      </Reveal>
    </div>
  );
}
