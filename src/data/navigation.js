import { Home, Layers, MoonStar, BookOpen, Orbit, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "./categories";

/* Sidebar menu — the Home page mirrors every entry here. */
export const NAV = [
  {
    heading: "DISCOVER",
    items: [
      { to: "/", label: "Home", Icon: Home, end: true },
      { to: "/cards", label: "All Cards", Icon: Layers },
      { to: "/manage", label: "Deck Manager", Icon: SlidersHorizontal },
      { to: "/reading", label: "Reading", Icon: MoonStar },
    ],
  },
  {
    heading: "EXPLORE",
    items: CATEGORIES.map((c) => ({ to: `/explore/${c.slug}`, label: c.title, Icon: c.Icon })),
  },
  {
    heading: "ABOUT",
    items: [
      { to: "/about/tarot", label: "What is Tarot?", Icon: BookOpen },
      { to: "/about/major-arcana", label: "About the Major Arcana", Icon: Orbit },
    ],
  },
];
