import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Bot detection: use LIVE mode in production, DRY_RUN in development
    // See valid bot identifiers at: https://arcjet.com/bot-list
    detectBot({
      mode: ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR",       // Uptime monitoring services
        "CATEGORY:PREVIEW",       // Link previews e.g. Slack, Discord
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
