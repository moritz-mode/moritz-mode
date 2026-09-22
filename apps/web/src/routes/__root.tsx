import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import appCss from "../index.css?url";

export type RouterAppContext = Record<string, unknown>;

const TITLE = "Moritz Mauruschat";
const IMAGE_URL = "https://moritzmode.com/moritz.jpg";
const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Moritz Mauruschat",
  givenName: "Moritz",
  familyName: "Mauruschat",
  jobTitle: "CTO & Co-Founder",
  url: "https://moritzmode.com",
  image: IMAGE_URL,
  worksFor: {
    "@type": "Organization",
    name: "90/10",
    url: "https://9010.berlin",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Technische Universität Berlin" },
    { "@type": "CollegeOrUniversity", name: "Hasso Plattner Institute" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Berlin",
    addressCountry: "DE",
  },
  sameAs: [
    "https://github.com/moritz-mode",
    "https://www.linkedin.com/in/mauruschatm/",
    "https://x.com/moritzmode",
  ],
});

const DESCRIPTION =
  "CTO & Co-Founder of 90/10, Berlin. Building the interface for AI in construction, starting with how projects are won.";

const RootDocument = () => (
  <html className="dark" lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://moritzmode.com" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMAGE_URL },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{ type: "application/ld+json", children: PERSON_JSON_LD }],
  }),
  component: RootDocument,
});
