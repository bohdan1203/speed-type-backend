import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    results: [
      {
        type: Schema.Types.ObjectId,
        ref: "Result",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
