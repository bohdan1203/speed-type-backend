import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../../models/user";

interface UpdateUserParams {
  userId?: string;
}

interface UpdateUserBody {
  username?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const updateUser: RequestHandler<
  UpdateUserParams,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!userId) {
      throw createHttpError(401, "Unauthorized: Missing userId");
    }

    if ((newPassword || confirmNewPassword) && !oldPassword) {
      throw createHttpError(400, "Invalid Request: Missing oldPassword");
    }

    if (!username && !oldPassword) {
      throw createHttpError(400, "Invalid Request: No updates provided");
    }

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throw createHttpError(403, "Forbidden: User not found");
    }

    if (username) {
      if (username === existingUser.username) {
        throw createHttpError(400, "Invalid Request: Nothing to update");
      }

      existingUser.username = username;
      await existingUser.save();
    }

    if (oldPassword) {
      if (!newPassword) {
        throw createHttpError(400, "Invalid Request: Missing newPassword");
      }

      if (newPassword !== confirmNewPassword) {
        throw createHttpError(
          400,
          "Invalid Request: New passwords don't match"
        );
      }

      const oldPasswordsMatch = await bcrypt.compare(
        oldPassword,
        existingUser.password
      );

      if (!oldPasswordsMatch) {
        throw createHttpError(403, "Forbidden: Incorrect old password");
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      existingUser.password = hashedNewPassword;
      await existingUser.save();
    }

    res.status(200).json({
      message: `User ${existingUser.username} has been updated successfully`,
      user: { userId: existingUser._id, username: existingUser.username },
    });
  } catch (error) {
    next(error);
  }
};
