import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { BrandIcon } from "../brand-icons";
import type { IconName } from "../brand-icons";
import { SwappingName } from "../power-name/swapping-name";
import { useNameSwap } from "../power-name/use-name-swap";

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
    className="border-muted-foreground/60 hover:border-foreground hover:text-foreground cursor-pointer border-b pb-px whitespace-nowrap transition-colors"
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {icon ? <BrandIcon name={icon} /> : null}
    {icon && !iconOnly ? " " : null}
    {iconOnly ? <span className="sr-only">{children}</span> : children}
  </a>
);

const BerlinClock = () => {
  const time = useBerlinTime();
  return (
    <p className="text-muted-foreground">
      See you in <InlineLink href="https://berlin.sh">Berlin</InlineLink>, where
      it is <span suppressHydrationWarning>{time}</span> right now.
    </p>
  );
};

const HomeComponent = () => {
  const { swapped, hoverProps } = useNameSwap();
  return (
    <main className="flex min-h-svh items-center justify-center overflow-x-clip px-6 py-16">
      <article className="w-full max-w-md space-y-8">
        <header
          className="flex cursor-crosshair items-center gap-4 select-none"
          {...hoverProps}
        >
          <img
            alt="Moritz Mauruschat"
            className="size-16 shrink-0 rounded-xl object-cover"
            height={64}
            src="/moritz.jpg"
            width={64}
          />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              <SwappingName swapped={swapped} />
            </h1>
            <p className="text-muted-foreground text-sm">
              CTO &amp; Co-Founder, 90/10
            </p>
          </div>
        </header>

        <div className="space-y-5 text-base leading-relaxed">
          <p className="text-muted-foreground">
            Into nature, random acts of kindness, and helping traditional
            companies catch up with tech.
          </p>
          <p>
            I co-founded{" "}
            <InlineLink href="https://9010.berlin" icon="nineTen">
              90/10
            </InlineLink>{" "}
            with Lee-Ann Beeck. We build the interface for AI in construction,
            starting with how projects are won.
          </p>
          <p className="text-muted-foreground">
            The path here started early. I led my first dev team at 16 and ran a
            marketing agency alongside my A-levels.
          </p>
          <p className="text-muted-foreground">
            Then came business informatics at{" "}
            <InlineLink href="https://www.tu.berlin" icon="tuBerlin">
              TU Berlin
            </InlineLink>{" "}
            and Kraft Labs, an operating system for trade businesses that Nikias
            Deike and I took through the{" "}
            <InlineLink href="https://www.engine.hpi.de" icon="hpiEngine">
              HPI Engine
            </InlineLink>{" "}
            Incubator.
          </p>
          <p className="text-muted-foreground">
            Mostly TypeScript these days, happiest with{" "}
            <InlineLink href="https://convex.dev" icon="convex">
              Convex
            </InlineLink>
            ,{" "}
            <InlineLink href="https://tanstack.com" icon="tanstack">
              TanStack
            </InlineLink>
            ,{" "}
            <InlineLink href="https://railway.com" icon="railway">
              Railway
            </InlineLink>
            , and{" "}
            <InlineLink href="https://posthog.com" icon="posthog">
              PostHog
            </InlineLink>{" "}
            in the stack.
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
          <BerlinClock />
        </div>
      </article>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
