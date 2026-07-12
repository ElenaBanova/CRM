import { model, Schema } from "mongoose";

import { IGroup } from "../interfaces/group.interface";

const groupSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false },
);

export const Group = model<IGroup>("groups", groupSchema);
