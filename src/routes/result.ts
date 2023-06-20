import express from "express";
import * as resultController from "../controllers/result";

const router = express.Router();

router.get("/", resultController.getAllResults);
router.get("/users/:userId", resultController.getUserResults);
router.get("/texts/:textId", resultController.getTextResults);
router.post("/", resultController.addResult);

export default router;
