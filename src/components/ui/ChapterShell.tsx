"use client";

import { forwardRef, type ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Optional absolutely-positioned background (canvas, gradients). */
  background?: ReactNode;
  full?: boolean;
};

/**
 * A full-height cinematic section: an optional 3D/gradient background layer,
 * a chapter eyebrow + serif title, and the chapter's content.
 */
const ChapterShell = forwardRef<HTMLElement, Props>(function ChapterShell(
  { id, eyebrow, title, subtitle, children, className = "", background, full = true },
  ref
) {
  return (
    <section
      id={id}
      ref={ref}
      className={`relative w-full overflow-hidden ${
        full ? "min-h-screen" : ""
      } ${className}`}
    >
      {background && <div className="absolute inset-0">{background}</div>}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-24 md:px-10">
        {(eyebrow || title) && (
          <header className="mb-10 md:mb-16">
            {eyebrow && (
              <Reveal>
                <p className="mb-4 text-xs uppercase tracking-cinematic text-accent">
                  {eyebrow}
                </p>
              </Reveal>
            )}
            {title && (
              <Reveal delay={0.08}>
                <h2 className="font-serif-title text-4xl leading-[1.05] text-primary md:text-6xl">
                  {title}
                </h2>
              </Reveal>
            )}
            {subtitle && (
              <Reveal delay={0.16}>
                <p className="mt-4 max-w-xl text-base text-secondary md:text-lg">
                  {subtitle}
                </p>
              </Reveal>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
});

export default ChapterShell;
