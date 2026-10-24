export const SPREADS = [
  {
    id: "three", number: "01", title: "Three Card Reading",
    subtitle: "Past · Present · Future",
    description: "A simple spread for understanding the journey ahead.",
    positions: ["Past", "Present", "Future"], preview: "three-card",
  },
  {
    id: "one", number: "02", title: "One Card",
    subtitle: "The Card of the Day",
    description: "One archetype. One message. One moment of reflection.",
    positions: ["Your Card"], preview: "one-card",
  },
  {
    id: "relationship", number: "03", title: "Relationship",
    subtitle: "You · Them · Connection · Advice",
    description: "Explore the dynamics and energies within a relationship.",
    positions: ["You", "Them", "Connection", "Advice"], preview: "relationship",
  },
];

export const getSpread = (id) => SPREADS.find((s) => s.id === id) ?? SPREADS[0];
