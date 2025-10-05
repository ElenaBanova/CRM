import { CoursesEnum } from "../enums/courses.enum";
import { FormatCoursesEnum } from "../enums/format-courses.enum";
import { StatusApplicationsEnum } from "../enums/status-applications.enum";
import { TypeCoursesEnum } from "../enums/type-courses.enum";
import { IBase } from "./base.interface";

interface IApplication extends IBase {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: CoursesEnum;
  course_format: FormatCoursesEnum;
  course_type: TypeCoursesEnum;
  sum: number;
  already_paid: number;
  utm: string;
  msg: string;
  status: StatusApplicationsEnum;
  group: string;
  manager: string;
}

interface IApplicationCreate {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  course?: CoursesEnum;
  course_format?: FormatCoursesEnum;
  course_type?: TypeCoursesEnum;
  sum?: number;
  already_paid?: number;
  utm?: string;
  msg?: string;
  status?: StatusApplicationsEnum;
}

interface IApplicationUpdate {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  course?: CoursesEnum;
  course_format?: FormatCoursesEnum;
  course_type?: TypeCoursesEnum;
  sum?: number;
  already_paid?: number;
  status?: StatusApplicationsEnum;
  group?: string;
  manager?: string;
}

interface IApplicationQuery {
  pageSize: number;
  page: number;
  search?: string;
  order?: string;
}

export {
  IApplication,
  IApplicationCreate,
  IApplicationQuery,
  IApplicationUpdate,
};
