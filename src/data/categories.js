import { Heart, Briefcase, Sprout, Moon, Sparkles } from "lucide-react";

/* The five "Explore" themes.
   field → which text on each card is shown on the theme page */
export const CATEGORIES = [
  {
    slug: "love", title: "Love & Relationships", tagline: "Find your heart's message",
    tone: "rose", Icon: Heart, field: "love",
    intro: "Tarot cannot predict who you will love, but it can help you notice how you love. These cards speak to connection, desire, boundaries and the stories we tell ourselves about intimacy.",
    questions: [
      "What do I truly need from the people closest to me?",
      "Where am I giving more — or less — than I want to?",
      "What would honest, gentle communication look like right now?",
    ],
  },
  {
    slug: "career", title: "Career", tagline: "Clarity for your path",
    tone: "lavender", Icon: Briefcase, field: "career",
    intro: "Work, ambition and purpose, seen through archetypes. These cards offer a mirror for decisions about your path, your craft and the way you lead or follow.",
    questions: [
      "What am I building, and does it still feel like mine?",
      "Which skill am I underusing?",
      "What would a sustainable next step look like?",
    ],
  },
  {
    slug: "growth", title: "Personal Growth", tagline: "Discover your potential",
    tone: "sage", Icon: Sprout, field: "growth",
    intro: "Every card in the Major Arcana is a chapter of becoming. These ones speak most directly to self-knowledge, learning and the slow work of changing.",
    questions: [
      "What am I ready to learn?",
      "Which habit or belief is asking to be outgrown?",
      "How can I be kinder to myself while I change?",
    ],
  },
  {
    slug: "shadow", title: "Shadow & Challenges", tagline: "Face what's hidden",
    tone: "lavender", Icon: Moon, field: "summary",
    intro: "Difficult cards are not bad omens; they are honest ones. These archetypes ask you to look at fear, attachment, illusion and upheaval so you can move through them with more awareness.",
    questions: [
      "What am I avoiding looking at?",
      "What pattern keeps repeating, and what might it be protecting?",
      "What would feel like one small act of courage today?",
    ],
  },
  {
    slug: "hope", title: "Hope & Healing", tagline: "Find your light",
    tone: "rose", Icon: Sparkles, field: "summary",
    intro: "When things feel heavy, these cards point toward light: renewal, courage, joy and the sense that a cycle can turn. Hope here is practical, not naive.",
    questions: [
      "What is quietly getting better?",
      "What do I need in order to rest and refill?",
      "Whom or what can I lean on right now?",
    ],
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
