import { CoursesEnum } from "../enums/courses.enum";
import { FormatCoursesEnum } from "../enums/format-courses.enum";
import { StatusOrdersEnum } from "../enums/status-orders.enum";
import { TypeCoursesEnum } from "../enums/type-courses.enum";

interface IOrder {
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
  status: StatusOrdersEnum;
  group: string;
  manager: string;
  created_at: Date;
  updatedAt: Date;
}

interface IOrderCreate {
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
  status?: StatusOrdersEnum;
}

interface IOrderUpdate {
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
  status?: StatusOrdersEnum;
  group?: string;
  manager?: string;
}

interface IOrderQuery {
  pageSize: number;
  page: number;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  course?: CoursesEnum;
  course_format?: FormatCoursesEnum;
  course_type?: TypeCoursesEnum;
  status?: StatusOrdersEnum;
  created_at?: Date;
  group?: string;
  order?: string;
  manager?: string;
}

interface IOrderWithIndex {
  rowNumber: number;
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
  status: StatusOrdersEnum;
  group: string;
  manager: string;
  created_at: Date;
  updatedAt: Date;
}

interface IResponseOrders {
  orders: IOrderWithIndex[];
  totalItems: number;
}

export {
  IOrder,
  IOrderCreate,
  IOrderQuery,
  IOrderUpdate,
  IOrderWithIndex,
  IResponseOrders,
};
