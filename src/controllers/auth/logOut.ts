import { RequestHandler } from "express";
import createHttpError from "http-errors";

import UserModel from "../../models/user";

interface LogOutParams {
  userId: string;
}

export const logOut: RequestHandler<
  LogOutParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw createHttpError(400, "User ID is required.");
    }

    const existingUser = await UserModel.findById(userId).exec();

    if (!existingUser) {
      throw createHttpError(404, "User not found.");
    }

    existingUser.refreshToken = "";
    await existingUser.save();

    res.setHeader("Set-Cookie", [
      "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
