import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

const BERLIN_TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});
const ONE_MINUTE_MS = 60_000;

const formatBerlinTime = () => BERLIN_TIME.format(new Date());

const subscribeEveryMinute = (onTick: () => void) => {
  const id = setInterval(onTick, ONE_MINUTE_MS);
  return () => clearInterval(id);
};

const useBerlinTime = () =>
  useSyncExternalStore(
    subscribeEveryMinute,
    formatBerlinTime,
    formatBerlinTime
  );

const BerlinClock = () => {
  const time = useBerlinTime();
  return (
    <p className="text-muted-foreground text-xs">
      It&apos;s <span suppressHydrationWarning>{time}</span> in Berlin.
    </p>
  );
};

const ICON_PATHS = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

const NINE_TEN_MARK_PATH =
  "M56.132 70.132q9.438 0 16.896 4.422 7.524 4.422 11.88 12.342 4.356 7.854 4.356 18.216V132.7q0 11.22-4.356 19.404-4.356 8.118-12.276 12.54Q64.712 169 54.02 169q-6.93 0-13.2-2.046-6.204-2.112-11.484-6.93L42.14 147.22a17.2 17.2 0 0 0 5.478 3.696q3.168 1.32 6.402 1.32 5.148 0 8.91-2.376 3.828-2.442 5.874-6.27 2.112-3.894 2.112-8.25v-14.124l3.036 3.3q-4.026 4.158-9.438 6.402-5.412 2.178-11.154 2.178-8.976 0-15.84-4.026-6.798-4.026-10.692-11.022Q23 111.052 23 102.076t4.554-16.17q4.554-7.26 12.078-11.484 7.524-4.29 16.5-4.29m0 17.16q-4.092 0-7.524 1.98a15.36 15.36 0 0 0-5.412 5.346q-1.98 3.366-1.98 7.458t1.98 7.524a15.36 15.36 0 0 0 5.346 5.412q3.366 1.98 7.458 1.98t7.458-1.98q3.432-2.046 5.412-5.412 2.046-3.432 2.046-7.524 0-3.96-1.98-7.326a15.36 15.36 0 0 0-5.346-5.412q-3.366-2.046-7.458-2.046M132.437 169q-10.56 0-18.48-4.422t-12.342-12.342-4.422-18.48v-28.512q0-10.56 4.422-18.48t12.342-12.342T132.437 70t18.48 4.422 12.342 12.342 4.422 18.48v28.512q0 10.56-4.422 18.48t-12.342 12.342-18.48 4.422m0-17.028q4.752 0 8.58-2.244a16.74 16.74 0 0 0 6.072-6.072q2.244-3.828 2.244-8.58v-31.284q0-4.752-2.244-8.58a16.74 16.74 0 0 0-6.072-6.072q-3.828-2.244-8.58-2.244t-8.58 2.244a16.74 16.74 0 0 0-6.072 6.072q-2.244 3.828-2.244 8.58v31.284q0 4.752 2.244 8.58a16.74 16.74 0 0 0 6.072 6.072q3.828 2.244 8.58 2.244m67.166-79.992h17.952l-25.344 95.04h-17.952z";
const NINE_TEN_MASK_ID = "nine-ten-mask";

type IconName = keyof typeof ICON_PATHS | "nineTen";

const ICON_CLASS_NAME = "mx-[0.15em] inline size-[1em] align-[-0.125em]";

const BrandIcon = ({ name }: { name: IconName }) => {
  if (name === "nineTen") {
    return (
      <svg aria-hidden="true" className={ICON_CLASS_NAME} viewBox="0 0 240 240">
        <mask id={NINE_TEN_MASK_ID}>
          <rect fill="#fff" height="240" rx="48" width="240" />
          <path d={NINE_TEN_MARK_PATH} fill="#000" />
        </mask>
        <rect
          fill="currentColor"
          height="240"
          mask={`url(#${NINE_TEN_MASK_ID})`}
          rx="48"
          width="240"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className={ICON_CLASS_NAME}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
};

const InlineLink = ({
  href,
  icon,
  iconOnly = false,
  children,
}: {
  href: string;
  icon?: IconName;
  iconOnly?: boolean;
  children: ReactNode;
}) => (
  <a
    className="border-muted-foreground/60 hover:border-foreground text-foreground border-b pb-px whitespace-nowrap transition-colors"
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {icon ? <BrandIcon name={icon} /> : null}
    {icon && !iconOnly ? " " : null}
    {iconOnly ? <span className="sr-only">{children}</span> : children}
  </a>
);

const HomeComponent = () => (
  <main className="flex min-h-svh items-center justify-center px-6 py-16">
    <article className="w-full max-w-md space-y-8">
      <header className="flex items-center gap-4">
        <img
          alt="Moritz Mauruschat"
          className="size-16 shrink-0 rounded-xl object-cover"
          height={64}
          src="/moritz.jpg"
          width={64}
        />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Moritz Mauruschat
          </h1>
          <p className="text-muted-foreground text-sm">
            CTO &amp; Co-Founder, 90/10
          </p>
        </div>
      </header>

      <div className="space-y-5 text-base leading-relaxed">
        <p>
          I co-founded{" "}
          <InlineLink href="https://9010.berlin" icon="nineTen">
            90/10
          </InlineLink>{" "}
          with Lee-Ann Beeck. We turn construction tenders, whether GAEB, PDF or
          Excel, into reviewable draft offers in minutes, so trade businesses
          can spend 90% of their time building and 10% at a desk.
        </p>
        <p className="text-muted-foreground">
          Into nature, random acts of kindness, and helping traditional
          companies catch up with tech. Hasso Plattner Institute alum. Mostly
          shipping TypeScript. 🚢
        </p>
        <p>
          I ship on{" "}
          <InlineLink href="https://github.com/moritz-mode" icon="github">
            GitHub
          </InlineLink>
          , post on{" "}
          <InlineLink href="https://x.com/moritzmode" icon="x" iconOnly>
            X
          </InlineLink>
          , and answer on{" "}
          <InlineLink
            href="https://www.linkedin.com/in/mauruschatm/"
            icon="linkedin"
          >
            LinkedIn
          </InlineLink>
          .
        </p>
      </div>

      <BerlinClock />
    </article>
  </main>
);

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
