import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TarotCard from "../components/TarotCard";
import NotFound from "./NotFound";
import { CARDS, STAGES, inStage } from "../data/cards";

const PAGES = {
  tarot: {
    eyebrow: "THE BASICS",
    title: "What is Tarot?",
    lead: "Tarot is a deck of 78 illustrated cards used for storytelling, reflection and self-inquiry. Each card carries imagery and symbolism that invite you to notice what you already feel, fear or hope.",
    sections: [
      {
        heading: "A brief history",
        body: [
          "Tarot began in 15th-century Italy as a set of playing cards for a trick-taking game. Its use for divination and symbolic reflection grew from the late 18th century onward.",
          "The best-known modern deck, the Rider–Waite–Smith, was published in 1909 and shaped most of the imagery people recognise today.",
        ],
      },
      {
        heading: "A tool for reflection, not prediction",
        body: [
          "Arcana treats tarot as a mirror rather than a crystal ball. The cards do not fix your future; they offer images and questions that help you tell a clearer story about your present.",
          "Two people can draw the same card and find different meanings. That openness is the point.",
        ],
      },
    ],
    stepsTitle: "How to read a card",
    steps: [
      { title: "Set an intention", text: "A question, a feeling, or simply “what should I know today?”" },
      { title: "Draw", text: "Choose one card, or a spread of several." },
      { title: "Look first", text: "Notice colours, figures and mood before reading any meaning." },
      { title: "Read the keywords", text: "Compare your impression with the upright or reversed themes." },
      { title: "Reflect", text: "Ask how the card connects to something real in your life." },
    ],
  },

  "major-arcana": {
    eyebrow: "THE ARCHETYPES",
    title: "About the Major Arcana",
    lead: "The Major Arcana are the 22 trump cards of the tarot, numbered 0 to XXI. They depict the big archetypes and turning points of a human life, from innocent beginnings to a sense of completion.",
    sections: [
      {
        heading: "The Fool’s Journey",
        body: [
          "Many readers see the Major Arcana as a single story: the Fool (0) sets out, meets teachers, trials and mirrors, and finally arrives at the World (XXI). Each card is a stage on that road, and you may recognise yourself in several at once.",
        ],
      },
      {
        heading: "Major and Minor Arcana",
        body: [
          "A full tarot deck has 78 cards. The 22 Major Arcana point to major themes and life lessons; the 56 Minor Arcana, split into four suits, describe everyday events and moods. This archive focuses on the Major Arcana.",
        ],
      },
    ],
    showStages: true,
  },
};

export default function About() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) return <NotFound />;

  return (
    <div className="page">
      <div className="page-wrap about-page">
        <header className="about-head">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="about-lead">{page.lead}</p>
        </header>

        <div className="prose">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        {page.steps && (
          <section className="steps-block">
            <h2>{page.stepsTitle}</h2>
            <ol className="steps">
              {page.steps.map((step) => (
                <li key={step.title}>
                  <b>{step.title}</b>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {page.showStages && (
          <section className="steps-block">
            <h2>The three acts</h2>
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
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="about-cta">
          <Link className="btn" to="/cards">
            Browse the deck <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="btn btn-outline" to="/reading">
            Try a reading
          </Link>
        </div>
      </div>
    </div>
  );
}
