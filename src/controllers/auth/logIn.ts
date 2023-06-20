import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

import { generateTokens } from "../../util/generateTokens";

import UserModel from "../../models/user";
import processEnv from "../../util/validateEnv";

import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../../constants/tokenCookieOptions";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../constants/tokensExpireIn";

interface LogInBody {
  usernameOrEmail?: string;
  password?: string;
}

export const logIn: RequestHandler<
  unknown,
  unknown,
  LogInBody,
  unknown
> = async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      throw createHttpError(400, "Please fill in all the fields.");
    }

    const existingUser = await UserModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).exec();

    if (!existingUser) {
      throw createHttpError(400, "Invalid username, email, or password.");
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordsMatch) {
      throw createHttpError(400, "Invalid username, email, or password.");
    }

    const user = {
      userId: existingUser._id,
      username: existingUser.username,
    };

    const { accessToken, refreshToken } = generateTokens(
      existingUser._id.toString(),
      existingUser.username,
      processEnv.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRES_IN,
      processEnv.REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRES_IN
    );

    existingUser.refreshToken = refreshToken!;
    await existingUser.save();

    console.log("login, refresh", refreshToken);

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(200).json({
      message: `Hello, ${user.username}, you have logged in successfully.`,
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
