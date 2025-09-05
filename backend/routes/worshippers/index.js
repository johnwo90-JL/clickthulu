import express from "express";
import requireAuth from "../../middleware/auth.js";
import { listUserWorshippersController } from "./list.controller.js";
import { getWorshipperTypeController } from "./get.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Worshippers
 *   description: Worshipper ownership and metadata
 */

/**
 * @swagger
 * /api/worshippers:
 *   get:
 *     summary: List user's worshippers
 *     tags: [Worshippers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worshippers
 */
router.get("/", requireAuth, listUserWorshippersController);

/**
 * @swagger
 * /api/worshippers/{id}:
 *   get:
 *     summary: Get worshipper type including effects
 *     tags: [Worshippers]
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
 *         description: Worshipper type details
 */
router.get("/:id", requireAuth, getWorshipperTypeController);

export default router;
