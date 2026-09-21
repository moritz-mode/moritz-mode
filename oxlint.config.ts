import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, react, tanstack],
  // packages/ui is generated shadcn/ui code; keep it out of lint to avoid churn on upstream updates.
  ignorePatterns: [...core.ignorePatterns, "packages/ui/**"],
});
