import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import processEnv from "../util/validateEnv";

export const verifyAccessToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(req.headers);

  if (!authHeader?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Missing access token"));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, processEnv.ACCESS_TOKEN_SECRET, (error) => {
    if (error) {
      return next(createHttpError(403, "Invalid access token"));
    }

    console.log("Congratulations! You have passed this verification!");
    next();
  });
};
