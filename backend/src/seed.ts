/* eslint-disable no-console */
import mongoose from "mongoose";

import { config } from "./configs/config";
import { CoursesEnum } from "./enums/courses.enum";
import { FormatCoursesEnum } from "./enums/format-courses.enum";
import { RoleEnum } from "./enums/role.enum";
import { StatusOrdersEnum } from "./enums/status-orders.enum";
import { TypeCoursesEnum } from "./enums/type-courses.enum";
import { Group } from "./models/group.model";
import { Order } from "./models/order.model";
import { User } from "./models/user.model";
import { passwordService } from "./services/password.service";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";

const seed = async () => {
  await mongoose.connect(config.MONGO_URI);

  const exists = await User.exists({ email: ADMIN_EMAIL });

  if (!exists) {
    await User.create({
      name: "Admin",
      surname: "Admin",
      email: ADMIN_EMAIL,
      password: await passwordService.hashPassword(ADMIN_PASSWORD),
      role: RoleEnum.ADMIN,
      isActive: true,
    });
    console.log(`Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log("Admin already exists, nothing to do");
  }

  if (process.argv.includes("--demo")) {
    if ((await Order.countDocuments()) > 0) {
      console.log("Orders already exist, demo data skipped");
    } else {
      const groupNames = ["FS-01", "FE-01", "QA-01"];
      for (const name of groupNames) {
        await Group.updateOne({ name }, { name }, { upsert: true });
      }

      const courses = Object.values(CoursesEnum);
      const formats = Object.values(FormatCoursesEnum);
      const types = Object.values(TypeCoursesEnum);
      const statuses = [null, StatusOrdersEnum.NEW];

      const orders = Array.from({ length: 60 }, (_, i) => ({
        name: `Test${i + 1}`,
        surname: `User${i + 1}`,
        email: `test${i + 1}@example.com`,
        phone: `38050000${String(i).padStart(4, "0")}`,
        age: 18 + (i % 30),
        course: courses[i % courses.length],
        course_format: formats[i % formats.length],
        course_type: types[i % types.length],
        status: statuses[i % statuses.length],
        sum: 10000 + i * 100,
        already_paid: 0,
        utm: "seed",
        msg: "demo",
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
      }));

      await Order.collection.insertMany(orders);
      console.log(
        `Inserted ${orders.length} demo orders and ${groupNames.length} groups`,
      );
    }
  }

  await mongoose.disconnect();
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
