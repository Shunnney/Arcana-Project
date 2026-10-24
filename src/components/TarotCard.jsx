import { useState } from "react";

/* Real card artwork. If the image can't load (offline, blocked…),
   it falls back to the painted CSS card from the original design. */
export default function TarotCard({ card, reversed = false, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`tc card-${card.theme} ${reversed ? "is-reversed" : ""} ${className}`}>
        <span>{card.numeral}</span>
        <strong>{card.glyph}</strong>
        <em>{card.name.toUpperCase()}</em>
      </div>
    );
  }

  return (
    <img
      className={`card-image ${reversed ? "is-reversed" : ""} ${className}`}
      src={card.image}
      alt={`${card.name}${reversed ? " (reversed)" : ""}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
