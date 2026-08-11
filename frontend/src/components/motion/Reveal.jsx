import { motion, useReducedMotion } from "framer-motion";
import { riseIn, fadeIn, stagger, staggerItem, VIEWPORT } from "@/lib/motion";

/**
 * Reveals its children as they scroll into view.
 *
 * framer-motion rather than a CSS `view()` timeline, because scroll-driven CSS
 * animations still aren't in Safari or Firefox and section reveals need to work
 * everywhere. framer-motion is already in the bundle, so there's no added cost.
 *
 * When the visitor prefers reduced motion the content renders plainly — no
 * transform, no opacity ramp, no delay. It never becomes conditional on an
 * animation completing, which is the failure mode that hides content.
 */
export default function Reveal({
  children,
  as = "div",
  variant = "rise",
  delay = 0,
  className,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  const variants = variant === "fade" ? fadeIn : riseIn;

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered container. Children should be <RevealItem>.
 */
export function RevealGroup({ children, as = "div", each = 0.035, delay = 0, className, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      variants={stagger(each, delay)}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, as = "div", className, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  if (reduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag className={className} variants={staggerItem} {...rest}>
      {children}
    </Tag>
  );
}
