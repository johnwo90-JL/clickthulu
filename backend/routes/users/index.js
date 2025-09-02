import express from "express";
import requireAuth from "../../middleware/auth.js";
import { listUsersHandler } from "./list.controller.js";
import { getUserByIdHandler } from "./get.controller.js";
import { createUserHandler } from "./create.controller.js";
import { clickHandler } from "./click.controller.js";
import { listUserUpgradesHandler } from "./upgrades.controller.js";

const router = express.Router();

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
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 */
router.get("/", requireAuth, listUsersHandler);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
router.get("/:id", requireAuth, getUserByIdHandler);

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
 *       - BearerAuth: []
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
router.post("/:id/click", requireAuth, clickHandler);

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
router.get("/:id/upgrades", requireAuth, listUserUpgradesHandler);

export default router;
