import express from "express";
import requireAuth from "../../middleware/auth.js";
import { listUsersHandler } from "./list.controller.js";
import { getUserByIdHandler } from "./get.controller.js";
import { createUserHandler } from "./create.controller.js";
import { clickHandler } from "./click.controller.js";
import { listUserUpgradesHandler } from "./upgrades.controller.js";
import { listUserAchievementsHandler } from "./achievements.controller.js";
import { getMeHandler } from "./me.controller.js";

const router = express.Router();
// Resolve ":id" == "me" to the authenticated user's id
function resolveMeParam(req, res, next) {
  const idParam = req.params?.id;
  if (idParam !== "me") return next();
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.params.id = userId;
  return next();
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and gameplay endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 */
router.get("/", requireAuth, listUsersHandler);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get("/me", requireAuth, getMeHandler);

/**
 * @swagger
 * /api/users/me/achievements:
 *   get:
 *     summary: List active achievement definitions
 *     description: Returns all active achievement definitions. Moved from /api/achievements.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 */
// '/me/achievements' handled via '/:id/achievements' using 'me' alias

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get("/:id", requireAuth, resolveMeParam, getUserByIdHandler);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createUserHandler);

/**
 * @swagger
 * /api/users/{id}/click:
 *   post:
 *     summary: Register a user click
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Click registered
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/click", requireAuth, resolveMeParam, clickHandler);

/**
 * @swagger
 * /api/users/{id}/upgrades:
 *   get:
 *     summary: List user-owned upgrades
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of upgrades
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id/upgrades",
  requireAuth,
  resolveMeParam,
  listUserUpgradesHandler
);

/**
 * @swagger
 * /api/users/{id}/achievements:
 *   get:
 *     summary: List a user's unlocked achievements
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: me
 *     responses:
 *       200:
 *         description: Array of user achievements
 */
router.get(
  "/:id/achievements",
  requireAuth,
  resolveMeParam,
  listUserAchievementsHandler
);

export default router;
