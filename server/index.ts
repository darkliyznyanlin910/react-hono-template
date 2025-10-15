import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { env } from "#server/env.ts";
import { auth } from "#server/lib/auth.ts";

const baseRoutes = new Hono()
  .get("/health", (c) => {
    return c.json({
      status: "ok",
    });
  })
  .get("/api/runtime.js", (c) => {
    return c.text(
      `
    window.__env = ${JSON.stringify(Object.fromEntries(Object.entries(env).filter(([key]) => key.startsWith("VITE_"))), null, 2)}
    `.trim(),
      200,
      { "Content-Type": "application/javascript" },
    );
  })
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  .use("/assets/*", serveStatic({ root: "./dist/static" }))
  .use("/*", serveStatic({ root: "./dist/static" }))
  .get("*", serveStatic({ path: "./dist/static/index.html" }));

const apiRoutes = new Hono();

const app = new Hono().route("/api", apiRoutes).route("/", baseRoutes);

const server = {
  port: 4001,
  fetch: app.fetch,
};

console.log(`App is running on port 4001`);

export default server;
