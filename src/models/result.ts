import { InferSchemaType, Schema, model } from "mongoose";

const resultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    textId: {
      type: Schema.Types.ObjectId,
      ref: "Text",
      required: true,
    },
    textContent: {
      type: String,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    symbolsPerMinute: {
      type: Number,
      required: true,
    },
    wordsPerMinute: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type Result = InferSchemaType<typeof resultSchema>;

export default model<Result>("Result", resultSchema);
