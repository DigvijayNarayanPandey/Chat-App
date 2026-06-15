import { ENV } from "./env.js";

const defaultDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

// Only include default development origins in development mode
const effectiveDevOrigins = ENV.NODE_ENV === "development" ? defaultDevOrigins : [];

export const allowedOrigins = [
  ...new Set(
    [ENV.CLIENT_URL, ...effectiveDevOrigins]
      .flatMap((value) => (value ? value.split(",") : []))
      .map((value) => value.trim())
      .filter(Boolean)
  ),
];

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};
