import express from "express";
import { gameClickController } from "./click.controller.js";
import { gameCalculateController } from "./calculate.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Gameplay endpoints
 */

/**
 * @swagger
 * /api/game/click:
 *   post:
 *     summary: Register user clicks and award XP
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clicks:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Updated stats and deltas
 */
router.post("/click", gameClickController);

/**
 * @swagger
 * /api/game/calculate:
 *   get:
 *     summary: Apply passive income since last calculation
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated stats and per-second rates
 */
router.get("/calculate", gameCalculateController);

export default router;
