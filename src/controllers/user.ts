import { RequestHandler } from "express";
import createHttpError from "http-errors";

import UserModel from "../models/user";

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password -refreshToken");

    if (users.length === 0) {
      throw createHttpError(404, "No users found");
    }

    res.status(200).json({ message: "Users have been retrieved", users });
  } catch (error) {
    next(error);
  }
};

interface GetUserParams {
  userId?: string;
}

export const getUser: RequestHandler<
  GetUserParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw createHttpError(400, "User ID was not provided.");
    }

    const existingUser = await UserModel.findById(userId).select(
      "-password -refreshToken"
    );

    if (!existingUser) {
      throw createHttpError(404, "No user found");
    }

    res
      .status(200)
      .json({ message: "User has been retrieved", user: existingUser });
  } catch (error) {
    next(error);
  }
};
