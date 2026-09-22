import { useEffect, useState } from "react";
import type { AnimationEvent } from "react";

const FULL_NAME = "Moritz Mauruschat";
const FULL_HANDLE = "Moritz Mode";

type Phase = "idle" | "charging" | "release" | "running" | "powerdown";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BASE_CLASS: Record<Phase, string> = {
  charging: "animate-[whoosh-charge_300ms_cubic-bezier(0.6,0,0.9,0.4)_both]",
  idle: "",
  powerdown: "animate-[power-down_900ms_cubic-bezier(0.2,0.6,0.2,1)_both]",
  release: "animate-[whoosh-release_520ms_cubic-bezier(0.2,0.9,0.3,1)_both]",
  running: "animate-[power-hum_1.4s_ease-in-out_infinite]",
};

const SWEEP_BAND =
  "bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.55)_44%,#fff_50%,rgba(255,255,255,0.55)_56%,transparent_70%)] bg-[length:220%_100%] bg-clip-text text-transparent";

const SWEEP_CLASS: Record<Phase, string> = {
  charging: `${SWEEP_BAND} animate-[sweep-right_300ms_ease-in_both]`,
  idle: "opacity-0",
  powerdown: "opacity-0",
  release: `${SWEEP_BAND} animate-[sweep-right_420ms_ease-out_both]`,
  running: `${SWEEP_BAND} opacity-70 animate-[sweep-right_1.4s_linear_infinite]`,
};

const NEXT_PHASE: Partial<Record<Phase, Phase>> = {
  charging: "release",
  powerdown: "idle",
  release: "running",
};

export const useNameSwap = () => {
  const [swapped, setSwapped] = useState(false);
  return {
    hoverProps: {
      onBlur: () => setSwapped(false),
      onFocus: () => setSwapped(true),
      onMouseEnter: () => setSwapped(true),
      onMouseLeave: () => setSwapped(false),
    },
    swapped,
  };
};

export const SwappingName = ({ swapped }: { swapped: boolean }) => {
  const [word, setWord] = useState(FULL_NAME);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (swapped) {
        if (prefersReducedMotion()) {
          setWord(FULL_HANDLE);
          setPhase("running");
          return;
        }
        setPhase("charging");
        return;
      }
      setWord(FULL_NAME);
      setPhase(prefersReducedMotion() ? "idle" : "powerdown");
    });
    return () => cancelAnimationFrame(id);
  }, [swapped]);

  const handleAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    setPhase((current) => {
      if (current === "charging") {
        setWord(FULL_HANDLE);
      }
      return NEXT_PHASE[current] ?? current;
    });
  };

  return (
    <span className="relative inline-block">
      <span className="sr-only">{FULL_NAME}</span>
      <span
        aria-hidden="true"
        className={`relative inline-block origin-left whitespace-nowrap ${BASE_CLASS[phase]}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {word}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 whitespace-nowrap ${SWEEP_CLASS[phase]}`}
        >
          {word}
        </span>
      </span>
    </span>
  );
};
