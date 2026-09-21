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
const DESCRIPTION =
  "CTO & Co-Founder at 90/10, Berlin. Building products with TypeScript.";

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
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
});
