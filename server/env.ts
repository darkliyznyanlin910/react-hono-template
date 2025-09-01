import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_APP_URL: z.url(),
  },
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_SECURE: z.coerce.boolean(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_FROM: z.string(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VITE_APP_URL: process.env.VITE_APP_URL ?? `http://localhost:4000`,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

export type Env = {
  [K in keyof typeof env as K extends `VITE_${string}` ? K : never]: string;
};
