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

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      throw createHttpError(400, "Please fill in all the fields.");
    }

    const usernameRegex = /^(?=[a-zA-Z])[a-zA-Z0-9 -]{3,30}$/;

    if (!usernameRegex.test(username)) {
      throw createHttpError(
        400,
        "The username can only contain Latin letters, digits, dashes, and spaces."
      );
    }

    const existingUsername = await UserModel.findOne({ username }).exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "This username is already taken. Please choose another one."
      );
    }

    const existingEmail = await UserModel.findOne({ email }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "This email is already registered. Please log in or register with a different email."
      );
    }

    if (password !== confirmPassword) {
      throw createHttpError(400, "Passwords do not match.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(
      newUser._id.toString(),
      newUser.username,
      processEnv.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRES_IN,
      processEnv.REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRES_IN
    );

    newUser.refreshToken = refreshToken!;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.status(201).json({
      message: `New user ${username} created successfully.`,
      user: {
        userId: newUser?._id,
        username,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
