import { model, Schema } from "mongoose";

import { CoursesEnum } from "../enums/courses.enum";
import { FormatCoursesEnum } from "../enums/format-courses.enum";
import { StatusApplicationsEnum } from "../enums/status-applications.enum";
import { TypeCoursesEnum } from "../enums/type-courses.enum";
import { IApplication } from "../interfaces/application.interface";

const applicationSchema = new Schema(
  {
    name: { type: String },
    surname: { type: String },
    email: { type: String },
    phone: { type: String },
    age: { type: Number },
    course: { enum: CoursesEnum, type: String },
    course_format: { enum: FormatCoursesEnum, type: String },
    course_type: { enum: TypeCoursesEnum, type: String },
    status: {
      enum: StatusApplicationsEnum,
      type: String,
      default: StatusApplicationsEnum.NEW,
    },
    sum: { type: Number },
    already_paid: { type: Number },
    utm: { type: String },
    msg: { type: String },
    group: { type: Schema.Types.ObjectId, ref: "Application" },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const Application = model<IApplication>(
  "applications",
  applicationSchema,
);
