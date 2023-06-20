import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import { generateTokens } from "../../util/generateTokens";

import UserModel from "../../models/user";
import processEnv from "../../util/validateEnv";

import { extractTokenFromCookie } from "../../util/extractTokenFromCookie";

import { ACCESS_TOKEN_EXPIRES_IN } from "../../constants/tokensExpireIn";

export const refreshToken: RequestHandler = async (req, res, next) => {
  const { cookie } = req.headers;

  console.log("refreshing token...");

  try {
    if (!cookie) {
      throw createHttpError(401, "Missing cookies.");
    }

    const refreshToken = extractTokenFromCookie(cookie, "refreshToken");

    if (!refreshToken) {
      throw createHttpError(401, "Invalid refresh token.");
    }

    const decoded: any = jwt.verify(
      refreshToken,
      processEnv.REFRESH_TOKEN_SECRET
    );

    const existingUser = await UserModel.findById(decoded.userId).exec();

    if (!existingUser || decoded.userId !== existingUser._id.toString()) {
      throw createHttpError(403, "Invalid user or tampered refresh token.");
    }

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      throw createHttpError(401, "Refresh token has expired.");
    }

    const { accessToken: newAccessToken } = generateTokens(
      existingUser._id.toString(),
      existingUser.username,
      processEnv.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRES_IN
    );

    return res.status(200).json({
      message: "Tokens refreshed",
      user: { userId: existingUser._id, username: existingUser.username },
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};
