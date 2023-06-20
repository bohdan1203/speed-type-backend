import { InferSchemaType, Schema, model } from "mongoose";

const textSchema = new Schema({
  createdBy: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: "Result",
    },
  ],
});

export type Text = InferSchemaType<typeof textSchema>;

export default model<Text>("Text", textSchema);
