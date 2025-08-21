import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { env } from "./env";

const app = new Hono()
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
  .use(
    "/*",
    serveStatic({
      root: "./dist/static",
      index: "index.html",
      onNotFound: (path) => {
        console.log(path);
      },
    }),
  );

serve({
  port: 4001,
  fetch: app.fetch,
});

console.log(`App is running on port $4001`);
