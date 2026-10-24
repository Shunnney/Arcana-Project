import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1]; // smooth "expo out" curve
export const SPRING = { type: "spring", stiffness: 380, damping: 24 };

/* ---------- variants ---------- */
export const rise = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
  hover: { y: -7, transition: SPRING },
};

/* Reveal: fade + slide up when scrolled into view */
export function Reveal({ as = "div", delay = 0, y = 36, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Stagger: children animate in one after another */
export function Stagger({
  as = "div",
  gap = 0.08,
  delay = 0.05,
  children,
  ...rest
}) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Plain element that takes part in a <Stagger> */
export function StaggerItem({ as = "div", children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag variants={cardItem} {...rest}>
      {children}
    </Tag>
  );
}

const MotionLink = motion.create(Link);

/* Router <Link> that staggers in, lifts on hover, presses on click */
export function CardLink({ children, lift = 7, ...rest }) {
  return (
    <MotionLink
      variants={{ ...cardItem, hover: { y: -lift, transition: SPRING } }}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </MotionLink>
  );
}

/* Router <Link> styled as a button (className="btn btn-gold" etc.) */
export function Button({ children, ...rest }) {
  return (
    <MotionLink
      variants={{ hover: { y: -3, scale: 1.05, transition: SPRING } }}
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      {...rest}
    >
      {children}
    </MotionLink>
  );
}

/* Text link (className="link-arrow"): only its <Arrow /> moves on hover */
export function TextLink({ children, ...rest }) {
  return (
    <MotionLink whileHover="hover" {...rest}>
      {children}
    </MotionLink>
  );
}

/* Arrow that slides forward when its parent Button / CardLink / TextLink is hovered */
export function Arrow({ Icon = ArrowRight }) {
  return (
    <motion.span
      variants={{ hover: { x: 6, transition: SPRING } }}
      style={{ display: "inline-flex" }}
    >
      <Icon aria-hidden="true" />
    </motion.span>
  );
}

/* Tilt: card follows the mouse in 3D and floats gently */
export function Tilt({ children, max = 14, className = "" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), {
    stiffness: 180,
    damping: 16,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), {
    stiffness: 180,
    damping: 16,
  });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        whileHover={{ scale: 1.06 }}
        transition={SPRING}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* CountUp: number counts from 0 when scrolled into view */
export function CountUp({ value, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const target = Number(value);
  const isNumber = !Number.isNaN(target);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !isNumber) return;
    if (reduce) {
      setN(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, isNumber, target, reduce]);

  return (
    <b ref={ref} {...rest}>
      {isNumber ? n : value}
    </b>
  );
}
