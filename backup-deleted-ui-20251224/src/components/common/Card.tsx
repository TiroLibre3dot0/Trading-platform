import { PropsWithChildren } from "react";

interface CardProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const base =
  "card relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_90px_rgba(0,0,0,0.6)] hover:border-white/20";

export function Card({ as: Component = "div", className = "", children }: PropsWithChildren<CardProps>) {
  return <Component className={[base, className].filter(Boolean).join(" ")}>{children}</Component>;
}

export default Card;
