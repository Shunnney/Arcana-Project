import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import TarotCard from "../components/TarotCard";
import { CARDS, STAGES, inStage } from "../data/cards";
import { CardLink, Stagger } from "../components/Motion";

const CHIPS = [
  { id: "all", label: "All" },
  ...STAGES.map((s) => ({ id: String(s.id), label: s.label })),
];

export default function AllCards() {
  const [params, setParams] = useSearchParams();
  const stage = params.get("stage") ?? "all";
  const query = (params.get("q") ?? "").trim().toLowerCase();

  const setStage = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("stage");
    else next.set("stage", id);
    setParams(next, { replace: true });
  };

  const clearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next, { replace: true });
  };

  const visible = CARDS.filter((card) => {
    if (stage !== "all" && !inStage(card, Number(stage))) return false;
    if (!query) return true;
    const haystack = [
      card.name,
      card.numeral,
      card.summary,
      ...card.keywords,
      ...card.themes,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  return (
    <div className="page">
      <div className="page-wrap">
        <header className="page-header">
          <div>
            <span className="eyebrow">THE DECK</span>
            <h1>THE MAJOR ARCANA</h1>
            <p>22 cards. 22 archetypes. One journey.</p>
          </div>
          <div className="header-decoration" aria-hidden="true">
            ✧
          </div>
        </header>

        <div className="chips" role="group" aria-label="Filter cards">
          {CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`chip ${stage === chip.id ? "active" : ""}`}
              aria-pressed={stage === chip.id}
              onClick={() => setStage(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {query && (
          <p className="result-note">
            {visible.length} {visible.length === 1 ? "card" : "cards"} for “
            {params.get("q")}”
            <button type="button" onClick={clearSearch}>
              <X aria-hidden="true" /> Clear
            </button>
          </p>
        )}

        {visible.length === 0 ? (
          <div className="empty">
            <span>✦</span>
            <p>The cards are silent on that one. Try another word.</p>
          </div>
        ) : (
          <Stagger className="card-grid" gap={0.04} key={`${stage}-${query}`}>
            {visible.map((card) => (
              <CardLink
                key={card.id}
                className="card-link"
                to={`/cards/${card.slug}`}
              >
                <TarotCard card={card} />
                <span className="card-name">{card.name}</span>
                <small className="card-num">{card.numeral}</small>
              </CardLink>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
