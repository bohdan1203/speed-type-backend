import express from "express";

import * as userController from "../controllers/user";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:userId", userController.getUser);

export default router;
