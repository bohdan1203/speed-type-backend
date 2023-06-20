import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

import UserModel from "../models/user";
import TextModel from "../models/text";

export const getAllTexts: RequestHandler = async (req, res, next) => {
  try {
    const texts = await TextModel.find();
    res.status(200).json({ texts });
  } catch (error) {
    next(error);
  }
};

interface GetTextByIdParams {
  textId?: string;
}

export const getTextById: RequestHandler<
  GetTextByIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { textId } = req.params;

  try {
    if (!textId) {
      throw createHttpError(400, "Where the fuck is text id?");
    }

    const existingText = await TextModel.findById(textId).exec();

    console.log(existingText);

    if (!existingText) {
      throw createHttpError(404, "Nothing found, get lost.");
    }

    res.status(200).json({ text: existingText });
  } catch (error) {
    next(error);
  }
};

interface AddTextBody {
  userId?: string;
  content?: string;
}

export const addText: RequestHandler<
  unknown,
  unknown,
  AddTextBody,
  unknown
> = async (req, res, next) => {
  const { userId, content } = req.body;

  try {
    if (!content) {
      throw createHttpError(401, "Content field must be filled");
    }

    const createdBy = await UserModel.findById(userId);

    const newText = await TextModel.create({
      createdBy: createdBy?._id,
      content,
    });
    res.status(201).json({ newText });
  } catch (error) {
    next(error);
  }
};

interface DeleteTextParams {
  textId?: string;
}

export const deleteText: RequestHandler<
  DeleteTextParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { textId } = req.params;

  try {
    if (!textId || !isValidObjectId(textId)) {
      throw createHttpError(401, "Text id is not valid");
    }

    const existingNote = await TextModel.findById(textId);

    if (!existingNote) {
      throw createHttpError(401, "Text with provided id does not exist");
    }

    await existingNote.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
