import { stagger, useAnimate, useReducedMotion } from "motion/react";
import type { AnimationSequence } from "motion/react";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type Animate = ReturnType<typeof useAnimate>[1];
type Controls = ReturnType<Animate>;

interface Letter {
  char: string;
  key: string;
}

interface StreakSpec {
  top: string;
  left: string;
  width: number;
  duration: number;
  delay: number;
  gap: number;
}

interface EmberSpec {
  top: string;
  left: string;
  duration: number;
  delay: number;
  gap: number;
}

const PREFIX = "Moritz";
const NAME_WORD = "Mauruschat";
const HANDLE_WORD = "Mode";
const FULL_NAME = `${PREFIX} ${NAME_WORD}`;
const FULL_HANDLE = `${PREFIX} ${HANDLE_WORD}`;

const toLetters = (word: string): Letter[] => {
  const seen = new Map<string, number>();
  return [...word].map((char) => {
    const count = seen.get(char) ?? 0;
    seen.set(char, count + 1);
    return { char, key: `${char}${count}` };
  });
};

const PREFIX_LETTERS = toLetters(PREFIX);
const NAME_LETTERS = toLetters(NAME_WORD);
const HANDLE_LETTERS = toLetters(HANDLE_WORD);

const glow = (core: number, coreBlur: number, halo: number, haloBlur: number) =>
  `0px 0px ${coreBlur}px rgba(255, 255, 255, ${core}), 0px 0px ${haloBlur}px rgba(190, 225, 255, ${halo})`;
const GLOW_OFF = glow(0, 0, 0, 0);
const GLOW_MID = glow(0.55, 8, 0.4, 20);
const GLOW_HIGH = glow(1, 12, 0.95, 30);
const GLOW_SWEEP = glow(1, 8, 1, 28);

/** How long the name shakes and glows before it blows over to "Mode". */
const CHARGE_SECONDS = 0.36;
/** When the steady "running" loops take over from the one-shot entrance. */
const ENTER_TOTAL_MS = 720;
/** Running-state dimming so the light sweep reads as a real highlight. */
const RUNNING_OPACITY = 0.8;
const SHAKE = [0, -0.4, 0.4, -0.8, 0.8, -1.3, 1.3, -1.8, 1.8, -2.4, 2.4, 0];
const SETTLE_EASE = [0.16, 1, 0.3, 1] as const;

const STREAKS: readonly StreakSpec[] = [
  { delay: 0, duration: 0.42, gap: 0.55, left: "8%", top: "18%", width: 36 },
  { delay: 0.16, duration: 0.38, gap: 0.7, left: "30%", top: "36%", width: 28 },
  { delay: 0.32, duration: 0.5, gap: 0.45, left: "62%", top: "52%", width: 44 },
  { delay: 0.5, duration: 0.4, gap: 0.8, left: "14%", top: "66%", width: 30 },
  { delay: 0.08, duration: 0.46, gap: 0.6, left: "44%", top: "82%", width: 38 },
  { delay: 0.42, duration: 0.36, gap: 0.5, left: "78%", top: "28%", width: 26 },
  {
    delay: 0.26,
    duration: 0.44,
    gap: 0.65,
    left: "70%",
    top: "74%",
    width: 34,
  },
];

const EMBERS: readonly EmberSpec[] = [
  { delay: 0.1, duration: 1.2, gap: 0.3, left: "20%", top: "12%" },
  { delay: 0.5, duration: 1.4, gap: 0.2, left: "48%", top: "88%" },
  { delay: 0.9, duration: 1.1, gap: 0.4, left: "72%", top: "30%" },
  { delay: 0.3, duration: 1.3, gap: 0.35, left: "86%", top: "64%" },
  { delay: 0.7, duration: 1.5, gap: 0.25, left: "34%", top: "56%" },
  { delay: 1.1, duration: 1.2, gap: 0.3, left: "60%", top: "8%" },
];

const LETTER_STYLE: CSSProperties = {
  display: "inline-block",
  textShadow: GLOW_OFF,
};
const HIDDEN_LETTER_STYLE: CSSProperties = {
  ...LETTER_STYLE,
  filter: "blur(0px)",
  opacity: 0,
};

const SWEEP_MASK =
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #000 38%, #000 62%, rgba(0, 0, 0, 0) 100%)";
/**
 * A CSS mask clips to the element box, so the overlay gets this much bleed
 * on every side; otherwise the sweep's glow ends in a hard edge.
 */
const SWEEP_BLEED = 48;
const SWEEP_STYLE = {
  "--sweep-x": "-80%",
  WebkitMaskImage: SWEEP_MASK,
  WebkitMaskPosition: "var(--sweep-x) 50%",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "55% 100%",
  left: -SWEEP_BLEED,
  maskImage: SWEEP_MASK,
  maskPosition: "var(--sweep-x) 50%",
  maskRepeat: "no-repeat",
  maskSize: "55% 100%",
  opacity: 0,
  padding: SWEEP_BLEED,
  textShadow: GLOW_SWEEP,
  top: -SWEEP_BLEED,
} as CSSProperties;

const FLASH_STYLE: CSSProperties = {
  background: "linear-gradient(90deg, #fff, rgba(255, 255, 255, 0))",
  boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.55)",
  height: 2,
  left: "38%",
  marginTop: -1,
  opacity: 0,
  top: "50%",
  transformOrigin: "left center",
  width: 90,
};

const streakStyle = (spec: StreakSpec): CSSProperties => ({
  background: "linear-gradient(90deg, rgba(255, 255, 255, 0), #fff 70%, #fff)",
  boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
  height: 1.5,
  left: spec.left,
  opacity: 0,
  top: spec.top,
  transformOrigin: "left center",
  width: spec.width,
});

const emberStyle = (spec: EmberSpec): CSSProperties => ({
  boxShadow: "0 0 4px 1px rgba(255, 255, 255, 0.7)",
  left: spec.left,
  opacity: 0,
  top: spec.top,
});

const query = (root: HTMLElement, selector: string) => [
  ...root.querySelectorAll<HTMLElement>(selector),
];

/**
 * Charge: the whole name shakes harder and harder while its glow builds and a
 * ripple runs through the letters, with light streaks being pulled in from
 * the right. Release: "Mauruschat" is blown out to the right with motion blur
 * while "Mode" slams in from the left and the streaks reverse into a blast.
 */
const buildEnterSequence = (root: HTMLElement): AnimationSequence => {
  const release = CHARGE_SECONDS;
  const sequence: AnimationSequence = [
    [".pn-vis", { opacity: 1, scaleX: 1, skewX: 0 }, { at: 0, duration: 0.1 }],
    [".pn-vis", { x: SHAKE }, { at: 0, duration: release, ease: "linear" }],
    [
      ".pn-vis",
      { textShadow: GLOW_HIGH },
      { at: 0, duration: release, ease: "easeIn" },
    ],
    [
      ".pn-vis",
      { y: [0, -2, 0] },
      {
        at: 0,
        delay: stagger(0.012, { startDelay: 0.03 }),
        duration: 0.14,
        ease: "easeInOut",
      },
    ],
    [
      ".pn-streak",
      { opacity: [0, 1, 0], scaleX: [0.3, 1, 0.2], x: [200, 0] },
      {
        at: 0,
        delay: stagger(0.022, { startDelay: 0.02 }),
        duration: 0.2,
        ease: "easeIn",
      },
    ],
    [
      ".pn-prefix",
      { skewX: [0, -6, 0], x: [0, 3, 0] },
      { at: release, duration: 0.32, ease: "easeOut" },
    ],
    [
      ".pn-prefix",
      { textShadow: GLOW_MID },
      { at: release + 0.1, duration: 0.45, ease: "easeOut" },
    ],
    [
      ".pn-streak",
      { opacity: [0, 1, 0], scaleX: [0.2, 1.5, 0.4], x: [0, 280] },
      { at: release, delay: stagger(0.018), duration: 0.38, ease: "easeOut" },
    ],
  ];
  for (const [index, letter] of query(root, ".pn-out").entries()) {
    sequence.push([
      letter,
      { opacity: 0, scaleX: 1.7, skewX: -24, x: 80 + index * 16 },
      { at: release + index * 0.008, duration: 0.2, ease: "circOut" },
    ]);
  }
  for (const [index, letter] of query(root, ".pn-in").entries()) {
    const at = release + 0.07 + index * 0.04;
    sequence.push(
      [
        letter,
        { scaleX: [1.7, 1], skewX: [-18, 0], x: [-30, 0] },
        { at, duration: 0.34, ease: "backOut" },
      ],
      [
        letter,
        {
          filter: ["blur(4px)", "blur(0px)"],
          opacity: [0, 1],
          textShadow: [GLOW_HIGH, GLOW_MID],
        },
        { at, duration: 0.22, ease: "easeOut" },
      ]
    );
  }
  return sequence;
};

/**
 * The shock line that shoots out of the name at the moment of release. Kept
 * out of the sequence because the sequence compiler sorts wildcard keyframes
 * after explicit ones, which would show the bar during the charge.
 */
const startFlash = (animate: Animate): Controls =>
  animate(
    ".pn-flash",
    { opacity: [0, 1, 0], scaleX: [0.2, 1.8], x: [0, 220] },
    {
      delay: CHARGE_SECONDS,
      duration: 0.32,
      ease: "easeOut",
      times: [0, 0.04, 1],
    }
  );

/** Steady state while hovered: a light sweep, pulsing glow, streaks and embers. */
const startRunning = (animate: Animate, root: HTMLElement): Controls[] => {
  const list: Controls[] = [
    animate(".pn-sweep", { opacity: 1 }, { duration: 0.3 }),
    animate(
      ".pn-sweep",
      { "--sweep-x": ["-80%", "180%"] },
      {
        duration: 1,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 0.1,
      }
    ),
    animate(
      ".pn-prefix, .pn-in",
      { opacity: RUNNING_OPACITY },
      { duration: 0.4 }
    ),
    animate(
      ".pn-prefix, .pn-in",
      { textShadow: [GLOW_MID, GLOW_HIGH] },
      {
        duration: 0.7,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "mirror",
      }
    ),
  ];
  const sweepLetters = query(root, ".pn-sweep-in");
  for (const [index, letter] of query(root, ".pn-in").entries()) {
    const twin = sweepLetters[index];
    list.push(
      animate(
        twin ? [letter, twin] : [letter],
        { y: [0, -1.5, 0] },
        {
          delay: index * 0.09,
          duration: 0.55,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }
      )
    );
  }
  for (const [index, streak] of query(root, ".pn-streak").entries()) {
    const spec = STREAKS[index];
    if (!spec) {
      continue;
    }
    list.push(
      animate(
        streak,
        { opacity: [0, 1, 0], scaleX: [0.25, 1.3, 0.4], x: [0, 260] },
        {
          delay: spec.delay,
          duration: spec.duration,
          ease: "easeOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: spec.gap,
        }
      )
    );
  }
  for (const [index, ember] of query(root, ".pn-ember").entries()) {
    const spec = EMBERS[index];
    if (!spec) {
      continue;
    }
    list.push(
      animate(
        ember,
        { opacity: [0, 1, 0], scale: [0.5, 1, 0.3], x: [0, 80], y: [0, -12] },
        {
          delay: spec.delay,
          duration: spec.duration,
          ease: "easeOut",
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: spec.gap,
        }
      )
    );
  }
  return list;
};

/** Cooldown: "Mode" drifts off to the right, "Mauruschat" settles back in. */
const startCooldown = (animate: Animate, root: HTMLElement): Controls[] => {
  const list: Controls[] = [];
  for (const [index, letter] of query(root, ".pn-in").entries()) {
    list.push(
      animate(
        letter,
        {
          filter: "blur(4px)",
          opacity: 0,
          scaleX: 1.25,
          skewX: -12,
          x: 36 + index * 10,
          y: 0,
        },
        { delay: index * 0.03, duration: 0.42, ease: "easeOut" }
      )
    );
  }
  for (const [index, letter] of query(root, ".pn-out").entries()) {
    list.push(
      animate(
        letter,
        { opacity: 1, scaleX: 1, skewX: 0, x: 0, y: 0 },
        { delay: 0.14 + index * 0.022, duration: 0.6, ease: SETTLE_EASE }
      )
    );
  }
  list.push(
    animate(
      ".pn-prefix",
      { opacity: 1, skewX: 0, x: 0, y: 0 },
      { duration: 0.3 }
    ),
    animate(
      ".pn-vis",
      { textShadow: GLOW_OFF },
      { duration: 0.9, ease: "easeOut" }
    ),
    animate(".pn-sweep", { opacity: 0 }, { duration: 0.25 }),
    animate(".pn-sweep-in", { y: 0 }, { duration: 0.2 }),
    animate(
      ".pn-streak, .pn-ember, .pn-flash",
      { opacity: 0 },
      { duration: 0.22 }
    )
  );
  return list;
};

export const SwappingName = ({ swapped }: { swapped: boolean }) => {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const reducedMotion = useReducedMotion();
  const activeRef = useRef<Controls[]>([]);
  const timerRef = useRef(0);
  const armedRef = useRef(false);

  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion) {
      return;
    }
    if (!(swapped || armedRef.current)) {
      return;
    }
    armedRef.current = true;
    const stopAll = () => {
      window.clearTimeout(timerRef.current);
      for (const controls of activeRef.current) {
        controls.stop();
      }
      activeRef.current = [];
    };
    stopAll();
    if (swapped) {
      activeRef.current.push(
        animate(buildEnterSequence(root)),
        startFlash(animate)
      );
      timerRef.current = window.setTimeout(() => {
        activeRef.current.push(...startRunning(animate, root));
      }, ENTER_TOTAL_MS);
    } else {
      activeRef.current.push(...startCooldown(animate, root));
    }
    return stopAll;
  }, [animate, reducedMotion, scope, swapped]);

  if (reducedMotion) {
    return <span>{swapped ? FULL_HANDLE : FULL_NAME}</span>;
  }

  return (
    <span className="relative inline-block whitespace-nowrap" ref={scope}>
      <span className="sr-only">{FULL_NAME}</span>
      <span aria-hidden="true" className="inline-block whitespace-nowrap">
        {PREFIX_LETTERS.map((letter) => (
          <span
            className="pn-letter pn-vis pn-prefix"
            key={letter.key}
            style={LETTER_STYLE}
          >
            {letter.char}
          </span>
        ))}{" "}
        <span className="relative inline-block whitespace-nowrap">
          <span className="inline-block whitespace-nowrap">
            {NAME_LETTERS.map((letter) => (
              <span
                className="pn-letter pn-vis pn-out"
                key={letter.key}
                style={LETTER_STYLE}
              >
                {letter.char}
              </span>
            ))}
          </span>
          <span className="absolute top-0 left-0 inline-block whitespace-nowrap">
            {HANDLE_LETTERS.map((letter) => (
              <span
                className="pn-letter pn-in"
                key={letter.key}
                style={HIDDEN_LETTER_STYLE}
              >
                {letter.char}
              </span>
            ))}
          </span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="pn-sweep pointer-events-none absolute inline-block whitespace-nowrap text-white"
        style={SWEEP_STYLE}
      >
        {PREFIX_LETTERS.map((letter) => (
          <span className="inline-block" key={letter.key}>
            {letter.char}
          </span>
        ))}{" "}
        <span className="inline-block whitespace-nowrap">
          {HANDLE_LETTERS.map((letter) => (
            <span className="pn-sweep-in inline-block" key={letter.key}>
              {letter.char}
            </span>
          ))}
        </span>
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="pn-flash absolute rounded-full" style={FLASH_STYLE} />
        {STREAKS.map((spec) => (
          <span
            className="pn-streak absolute rounded-full"
            key={`${spec.left}-${spec.top}`}
            style={streakStyle(spec)}
          />
        ))}
        {EMBERS.map((spec) => (
          <span
            className="pn-ember absolute size-0.5 rounded-full bg-white"
            key={`${spec.left}-${spec.top}`}
            style={emberStyle(spec)}
          />
        ))}
      </span>
    </span>
  );
};
