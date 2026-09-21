import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import "varlock/auto-load";

export default Alchemy.Stack(
  "moritzmode",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* moritzmodeStack() {
    const webWorker = yield* Cloudflare.Website.Vite("web", {
      compatibility: {
        flags: ["nodejs_compat"],
      },
      dev: {
        port: 3001,
      },
      env: {},
      rootDir: "../../apps/web",
    });

    return {
      web: webWorker.url,
    };
  })
);
