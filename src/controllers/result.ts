import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

import ResultModel from "../models/result";
import UserModel from "../models/user";
import TextModel from "../models/text";

interface GetUserResultsParams {
  userId?: string;
}

export const getUserResults: RequestHandler<
  GetUserResultsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId || !isValidObjectId(userId)) {
      throw createHttpError(401, "User id is not valid");
    }

    const userResults = await ResultModel.find({ userId });

    if (!userResults) {
      throw createHttpError(404, "No results found for this user");
    }

    res.status(200).json({ message: "Here are your results", userResults });
  } catch (error) {
    next(error);
  }
};

interface GetTextResultsParams {
  textId?: string;
}

export const getTextResults: RequestHandler<
  GetTextResultsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { textId } = req.params;

  try {
    if (!textId || !isValidObjectId(textId)) {
      throw createHttpError(401, "Text id is not valid");
    }

    const textResults = await ResultModel.find({ textId });

    if (!textResults) {
      throw createHttpError(404, "No results found for this text");
    }

    res.status(200).json({ message: "Here are your results", textResults });
  } catch (error) {
    next(error);
  }
};

interface AddResultBody {
  userId?: string;
  textId?: string;
  textContent?: string;
  accuracy?: number;
  symbolsPerMinute?: number;
  wordsPerMinute?: number;
}

export const addResult: RequestHandler<
  unknown,
  unknown,
  AddResultBody,
  unknown
> = async (req, res, next) => {
  const {
    userId,
    textId,
    textContent,
    accuracy,
    symbolsPerMinute,
    wordsPerMinute,
  } = req.body;

  try {
    if (
      !userId ||
      !textId ||
      !textContent ||
      !accuracy ||
      !symbolsPerMinute ||
      !wordsPerMinute
    ) {
      throw createHttpError(401, "Parameter(s) missing");
    }

    const userResults = await ResultModel.find({ userId });
    const userSpeedResults = userResults.map((result) => result.wordsPerMinute);
    const bestUserSpeedResult = Math.max(...userSpeedResults);
    const isNewBestUserSpeedResult =
      userResults.length > 0 && wordsPerMinute > bestUserSpeedResult;

    const newResult = await ResultModel.create(req.body);

    await UserModel.findByIdAndUpdate(userId, {
      $push: { results: newResult._id },
    });

    await TextModel.findByIdAndUpdate(textId, {
      $push: { results: newResult._id },
    });

    res
      .status(201)
      .json({ message: "Result saved", newResult, isNewBestUserSpeedResult });
  } catch (error) {
    next(error);
  }
};

export const getAllResults: RequestHandler = async (req, res, next) => {
  try {
    const results = await ResultModel.find().exec();

    if (!results) {
      throw createHttpError(400, "Something fucked up.");
    }

    res.status(200).json({ message: "Results retrieved", results });
  } catch (error) {
    next(error);
  }
};
