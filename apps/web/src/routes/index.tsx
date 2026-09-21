import { createFileRoute } from "@tanstack/react-router";

const LINKS = [
  { href: "https://github.com/moritz-mode", label: "GitHub" },
  { href: "https://9010.berlin", label: "90/10" },
] as const;

const HomeComponent = () => (
  <main className="flex min-h-svh items-center justify-center px-6">
    <div className="w-full max-w-xl">
      <p className="text-muted-foreground mb-6 font-mono text-sm">
        moritzmode.com
      </p>
      <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Moritz Mauruschat
      </h1>
      <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
        CTO &amp; Co-Founder at 90/10, Berlin. Building construction tech with
        TypeScript.
      </p>
      <nav aria-label="Links" className="flex gap-6 font-mono text-sm">
        {LINKS.map(({ href, label }) => (
          <a
            className="decoration-muted-foreground/50 hover:decoration-foreground underline underline-offset-4 transition-colors"
            href={href}
            key={href}
            rel="noreferrer"
            target="_blank"
          >
            {label} ↗
          </a>
        ))}
      </nav>
    </div>
  </main>
);

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
