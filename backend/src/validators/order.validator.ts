import joi from "joi";

import { CoursesEnum } from "../enums/courses.enum";
import { FormatCoursesEnum } from "../enums/format-courses.enum";
import { OrderQueryOrderEnum } from "../enums/order-query-order.enum";
import { RegexEnum } from "../enums/regex.enum";
import { StatusOrdersEnum } from "../enums/status-orders.enum";
import { TypeCoursesEnum } from "../enums/type-courses.enum";

export class OrderValidator {
  private static name = joi.string().regex(RegexEnum.NAME);
  private static surname = joi.string().regex(RegexEnum.NAME);
  private static email = joi.string().email();
  private static phone = joi.string().regex(RegexEnum.PHONE_NUMBER);
  private static age = joi.number().min(2).max(100);
  private static course = joi.string().valid(...Object.values(CoursesEnum));
  private static course_format = joi
    .string()
    .valid(...Object.values(FormatCoursesEnum));
  private static course_type = joi
    .string()
    .valid(...Object.values(TypeCoursesEnum));
  private static status = joi
    .string()
    .valid(...Object.values(StatusOrdersEnum));
  private static sum = joi.number().min(1).max(500000);
  private static already_paid = joi.number().min(1).max(500000);
  private static utm = joi.string();
  private static msg = joi.string().max(30);

  public static create = joi.object({
    name: this.name,
    surname: this.surname,
    email: this.email,
    phone: this.phone,
    age: this.age,
    course: this.course,
    course_format: this.course_format,
    course_type: this.course_type,
    sum: this.sum,
    already_paid: this.already_paid,
    utm: this.utm,
    msg: this.msg,
    status: this.status,
  });

  public static update = joi.object({
    name: this.name.trim().allow(""),
    surname: this.surname.trim().allow(""),
    email: this.email.trim().allow(""),
    phone: this.phone.trim().allow(""),
    age: this.age.allow(""),
    course: this.course.allow(null),
    course_format: this.course_format.allow(null),
    course_type: this.course_type.allow(null),
    sum: this.sum.allow(""),
    already_paid: this.already_paid.allow(""),
    status: this.status.allow(null),
    group: joi.string().allow(null),
  });

  public static query = joi.object({
    pageSize: joi.number().min(1).default(25),
    page: joi.number().min(1).default(1),
    name: joi.string().trim(),
    surname: joi.string().trim(),
    email: joi.string().trim(),
    phone: joi.string().trim(),
    age: joi.number(),
    course: this.course,
    course_format: this.course_format,
    course_type: this.course_type,
    status: this.status,
    group: joi.string().trim(),
    manager: joi.string().trim(),
    order: joi
      .string()
      .valid(
        ...Object.values(OrderQueryOrderEnum),
        ...Object.values(OrderQueryOrderEnum).map((item) => `-${item}`),
      ),
  });

  public static queryExcel = joi.object({
    name: joi.string().trim(),
    surname: joi.string().trim(),
    email: joi.string().trim(),
    phone: joi.string().trim(),
    age: joi.number(),
    course: this.course,
    course_format: this.course_format,
    course_type: this.course_type,
    status: this.status,
    group: joi.string().trim(),
    manager: joi.string().trim(),
    order: joi
      .string()
      .valid(
        ...Object.values(OrderQueryOrderEnum),
        ...Object.values(OrderQueryOrderEnum).map((item) => `-${item}`),
      ),
  });
}
