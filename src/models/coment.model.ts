import { model, Schema } from "mongoose";

import { IComment } from "../interfaces/comment.interface";

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    _idApplication: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Application",
    },
  },
  { timestamps: true, versionKey: false },
);

export const Comment = model<IComment>("comments", commentSchema);
