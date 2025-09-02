import express from "express";
import requireAuth from "../../middleware/auth.js";
import { listUserCardsController } from "./list.controller.js";
import { getCardTypeController } from "./get.controller.js";
import { activateCardController } from "./activate.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card ownership and metadata
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: List user's owned cards
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 */
router.get("/", requireAuth, listUserCardsController);

/**
 * @swagger
 * /api/cards/{cardId}:
 *   get:
 *     summary: Get card type including effects
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card type details
 */
router.get("/:cardId", requireAuth, getCardTypeController);

/**
 * @swagger
 * /api/cards/{cardId}/activate:
 *   post:
 *     summary: Activate a card's effects for the authenticated user
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated stats and applied effects
 */
router.post("/:cardId/activate", requireAuth, activateCardController);

export default router;
