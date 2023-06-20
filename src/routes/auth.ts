import express from "express";

import { verifyAccessToken } from "../middleware/verifyAccessToken";

import { signUp } from "../controllers/auth/signUp";
import { logIn } from "../controllers/auth/logIn";
import { refreshToken } from "../controllers/auth/refreshToken";
import { updateUser } from "../controllers/auth/updateUser";
import { logOut } from "../controllers/auth/logOut";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/refresh", refreshToken);
router.patch("/update/:userId", verifyAccessToken, updateUser);
router.delete("/logout/:userId", logOut);

export default router;
