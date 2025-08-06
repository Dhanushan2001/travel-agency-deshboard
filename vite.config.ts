import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryReactRouter, type SentryReactRouterBuildOptions} from "@sentry/react-router";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "travel-agency-i0",
  project: "travel-agecy",
  // An auth token is required for uploading source maps.
  authToken: "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"

};


export default defineConfig(config => {
  return {
    plugins: [tailwindcss(),tsconfigPaths(),reactRouter(),sentryReactRouter(sentryConfig, config)],
    sentryConfig,
    ssr:{
      noExternal:[/@syncfusion/]
    }
  };
});




