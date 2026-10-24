import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import TarotCard from "../components/TarotCard";
import SpreadPreview from "../components/SpreadPreview";
import SectionHeading from "../components/SectionHeading";
import { CARDS } from "../data/cards";
import { SPREADS, getSpread } from "../data/spreads";

/* pick a random card that hasn't been used yet (30% chance of reversed) */
function randomDraw(usedIds) {
  const pool = CARDS.filter((c) => !usedIds.includes(c.id));
  return {
    card: pool[Math.floor(Math.random() * pool.length)],
    reversed: Math.random() < 0.3,
  };
}

export default function Reading() {
  const [params, setParams] = useSearchParams();
  const spread = getSpread(params.get("spread"));

  const [question, setQuestion] = useState("");
  const [draws, setDraws] = useState({}); // { positionIndex: { card, reversed } }
  const [bulk, setBulk] = useState(false); // true → flip cards one after another

  // changing spread starts a fresh table
  useEffect(() => {
    setDraws({});
    setBulk(false);
  }, [spread.id]);

  const total = spread.positions.length;
  const drawnCount = Object.keys(draws).length;
  const allDrawn = drawnCount === total;
  const usedIds = () => Object.values(draws).map((d) => d.card.id);

  const revealOne = (index) => {
    if (draws[index]) return;
    setBulk(false);
    setDraws({ ...draws, [index]: randomDraw(usedIds()) });
  };

  const revealAll = () => {
    const next = { ...draws };
    const used = usedIds();
    spread.positions.forEach((_, i) => {
      if (!next[i]) {
        const pick = randomDraw(used);
        used.push(pick.card.id);
        next[i] = pick;
      }
    });
    setBulk(true);
    setDraws(next);
  };

  const reset = () => {
    setBulk(false);
    setDraws({});
  };

  return (
    <div className="page reading-page">
      <div className="reading-header">
        <p className="eyebrow">THE READING ROOM</p>
        <h1>
          What do the cards
          <br />
          have to say?
        </h1>
        <p className="reading-intro">
          Take a moment to reflect. Choose a spread, draw your cards, and let
          the archetypes reveal a story worth exploring.
        </p>
      </div>

      {/* 01 — SPREAD */}
      <div className="reading-section">
        <SectionHeading
          eyebrow="01 — CHOOSE YOUR SPREAD"
          title="Begin Your Reading"
        />

        <div className="spread-grid">
          {SPREADS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`spread-card ${s.id === spread.id ? "active" : ""}`}
              aria-pressed={s.id === spread.id}
              onClick={() => setParams({ spread: s.id }, { replace: true })}
            >
              <SpreadPreview spread={s} />
              <div className="spread-info">
                <h3>{s.title}</h3>
                <p>{s.subtitle}</p>
                <small>{s.description}</small>
              </div>
              <span className="spread-number">{s.number}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 02 — QUESTION */}
      <div className="question-box">
        <div className="question-icon">✦</div>
        <div className="question-content">
          <span className="eyebrow">BEFORE YOU DRAW</span>
          <h2>What is on your mind?</h2>
          <p>
            You don’t need to have a perfect question. Simply focus on something
            you would like to understand.
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Write your question or intention here..."
            aria-label="Your question or intention"
          />
        </div>
      </div>

      {/* 03 — DRAW */}
      <div className="draw-area">
        <div className="draw-decoration left" />

        <div className="draw-content">
          <span className="eyebrow">{spread.title.toUpperCase()}</span>
          <h2>Draw your cards</h2>
          <p>
            When you’re ready, choose each card — or draw them all at once — and
            allow its symbolism to guide your reflection.
          </p>

          <div className="reading-cards">
            {spread.positions.map((position, i) => {
              const draw = draws[i];
              return (
                <motion.button
                  key={`${spread.id}-${position}`}
                  type="button"
                  whileHover={draw ? undefined : { y: -12, rotate: -2 }}
                  whileTap={draw ? undefined : { scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`reading-card ${draw ? "revealed" : ""}`}
                  onClick={() => revealOne(i)}
                  disabled={Boolean(draw)}
                  aria-label={
                    draw
                      ? `${position}: ${draw.card.name}`
                      : `Reveal card for ${position}`
                  }
                >
                  <motion.span
                    className="rc-flip"
                    initial={false}
                    animate={{ rotateY: draw ? 180 : 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 13,
                      delay: bulk ? i * 0.18 : 0,
                    }}
                  >
                    <span className="rc-face rc-back card-back">
                      <span>✦</span>
                    </span>
                    <span className="rc-face rc-front">
                      {draw && (
                        <TarotCard card={draw.card} reversed={draw.reversed} />
                      )}
                    </span>
                  </motion.span>
                  <small>{position.toUpperCase()}</small>
                </motion.button>
              );
            })}
          </div>

          {allDrawn ? (
            <motion.button
              type="button"
              className="draw-button"
              onClick={reset}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
            >
              <RotateCcw aria-hidden="true" /> DRAW AGAIN
            </motion.button>
          ) : (
            <motion.button
              type="button"
              className="draw-button"
              onClick={revealAll}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
            >
              DRAW THE CARDS <ArrowRight aria-hidden="true" />
            </motion.button>
          )}
        </div>

        <div className="draw-decoration right" />
      </div>

      {/* RESULT */}
      <div aria-live="polite">
        {drawnCount > 0 && (
          <section className="reading-result">
            <SectionHeading
              eyebrow="YOUR READING"
              title="What the cards reveal"
            />

            {question.trim() && (
              <p className="result-question">
                <span>Your question</span> “{question.trim()}”
              </p>
            )}

            <div className="result-list">
              {spread.positions.map((position, i) => {
                const draw = draws[i];
                if (!draw) return null;
                const { card, reversed } = draw;

                return (
                  <article className="result-card" key={position}>
                    <div className="result-thumb">
                      <TarotCard card={card} reversed={reversed} />
                    </div>
                    <div>
                      <span className="eyebrow">{position}</span>
                      <h3>
                        {card.numeral} — {card.name}
                        {reversed && <em className="badge">Reversed</em>}
                      </h3>
                      <p className="sub">
                        {(reversed ? card.reversed : card.upright).join(" · ")}
                      </p>
                      <p className="result-text">
                        {reversed
                          ? `In reverse, ${card.name} points to ${card.reversed
                              .join(", ")
                              .toLowerCase()}. Ask where its energy feels blocked, delayed or turned inward.`
                          : card.meaning}
                      </p>
                      <Link className="link-arrow" to={`/cards/${card.slug}`}>
                        Read the full card <ArrowRight aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <div className="reading-note">
        <span>✦</span>
        <p>
          Tarot is a tool for reflection and storytelling. The cards do not
          determine your future. What you find in them is yours to interpret.
        </p>
      </div>
    </div>
  );
}
