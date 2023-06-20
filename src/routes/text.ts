import express from "express";

import * as textController from "../controllers/text";

import { verifyAccessToken } from "../middleware/verifyAccessToken";

const router = express.Router();

router.get("/", textController.getAllTexts);
router.get("/:textId", textController.getTextById);
router.post("/", verifyAccessToken, textController.addText);
router.delete("/:textId", verifyAccessToken, textController.deleteText);

export default router;
