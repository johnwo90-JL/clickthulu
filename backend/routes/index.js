import express from "express";
import userRouter from "./users/index.js";
import achievementsRouter from "./achievements/index.js";
import upgradesRouter from "./upgrades/index.js";
import serverRouter from "./server/index.js";
import gameRouter from "./game/index.js";
import requireAuth from "../middleware/auth.js";
import authRouter from "./auth/index.js";
import cardsRouter from "./cards/index.js";
import worshippersRouter from "./worshippers/index.js";

const router = express.Router();

if (process.env.NODE_ENV !== "test") {
  console.log("** Loading routes **");
}

// Safely parse env flags with defaults
const useApiPrefix =
  String(process.env.USE_API_PREFIX).toLowerCase() === "true";
const useVersioning =
  String(process.env.USE_VERSIONING).toLowerCase() === "true";

const versionNumber = String(process.env.VERSION_NUMBER);

const routerPrefix = useApiPrefix
  ? `/api${useVersioning ? `/v${versionNumber}` : ""}`
  : "";

router.use(`${routerPrefix}/users`, userRouter);
router.use(`${routerPrefix}/auth`, authRouter);
router.use(`${routerPrefix}/achievements`, achievementsRouter);
router.use(`${routerPrefix}/upgrades`, upgradesRouter);
router.use(`${routerPrefix}/server`, serverRouter);
router.use(`${routerPrefix}/game`, requireAuth, gameRouter);
router.use(`${routerPrefix}/cards`, cardsRouter);
router.use(`${routerPrefix}/worshippers`, worshippersRouter);

function countEndpoints(r) {
  if (!r || !Array.isArray(r.stack)) return 0;
  let count = 0;
  for (const layer of r.stack) {
    if (layer && layer.route && layer.route.methods) {
      count += Object.keys(layer.route.methods).length;
      continue;
    }
    if (
      layer &&
      layer.name === "router" &&
      layer.handle &&
      Array.isArray(layer.handle.stack)
    ) {
      count += countEndpoints(layer.handle);
    }
  }
  return count;
}

const routerMap = {
  users: userRouter,
  auth: authRouter,
  achievements: achievementsRouter,
  upgrades: upgradesRouter,
  server: serverRouter,
  game: gameRouter,
  cards: cardsRouter,
  worshippers: worshippersRouter,
};

const routersCount = router.stack.filter(
  (l) => l && l.name === "router"
).length;
const totalEndpointsCount = countEndpoints(router);

/**
 * List all routes for a given router
 * @param {express.Router} r - The router to list routes for
 * @returns {string[]} An array of strings representing the routes
 */
function listRoutes(r) {
  if (!r || !Array.isArray(r.stack)) return [];

  const lines = new Set();

  for (const layer of r.stack) {
    if (layer && layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods || {}).filter(
        (m) => layer.route.methods[m]
      );

      if (methods.length === 0) {
        lines.add(layer.route.path);
      } else {
        for (const m of methods) {
          lines.add(`${m.toUpperCase()} ${layer.route.path}`);
        }
      }
      continue;
    }

    if (
      layer &&
      layer.name === "router" &&
      layer.handle &&
      Array.isArray(layer.handle.stack)
    ) {
      for (const entry of listRoutes(layer.handle)) {
        lines.add(entry);
      }
    }
  }

  return Array.from(lines);
}

if (process.env.NODE_ENV !== "test") {
  console.log("Routes:");
  Object.entries(routerMap).forEach(([routerName, r]) => {
    const routes = listRoutes(r);
    console.log(
      `  /${routerName}\n      ${
        routes.length ? routes.join("\n      ") : "(none)"
      }`
    );
  });

  const msg = `\nLoaded ${routersCount} routers, ${totalEndpointsCount} endpoints`;
  console.log(msg);
  console.log("*".repeat(msg.length - 1));

  console.log("Users route full url: ", `${routerPrefix}/users`);
}

export default router;
