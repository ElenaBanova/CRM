import joi from "joi";

import { ApplicationQueryOrderEnum } from "../enums/application-query-order.enum";
import { CoursesEnum } from "../enums/courses.enum";
import { FormatCoursesEnum } from "../enums/format-courses.enum";
import { RegexEnum } from "../enums/regex.enum";
import { StatusApplicationsEnum } from "../enums/status-applications.enum";
import { TypeCoursesEnum } from "../enums/type-courses.enum";

export class ApplicationValidator {
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
    .valid(...Object.values(StatusApplicationsEnum));
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
    status: this.status,
    group: joi.string().trim(),
  });

  public static query = joi.object({
    pageSize: joi.number().min(1).max(100).default(25),
    page: joi.number().min(1).default(1),
    search: joi.string().trim(),
    order: joi
      .string()
      .valid(
        ...Object.values(ApplicationQueryOrderEnum),
        ...Object.values(ApplicationQueryOrderEnum).map((item) => `-${item}`),
      ),
  });
}
