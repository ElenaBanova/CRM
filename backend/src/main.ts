/* eslint-disable no-console */
/*eslint-disable @typescript-eslint/no-unused-vars */

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import { config } from "./configs/config";
import { openApiDocument } from "./configs/swagger.config";
import { ApiError } from "./errors/api.errors";
import { apiRouter } from "./routers/api.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:3000"] }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/", apiRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    let status = err.status || 500;
    const message = err.message ?? "Something went wrong";
    res.status(status).json({ status, message });
  },
);

process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
  process.exit(1);
});

const dbConnection = async () => {
  let dbCon = false;

  while (!dbCon) {
    try {
      await mongoose.connect(config.MONGO_URI);
      dbCon = true;
      console.log("MongoDB Connected");
    } catch (e) {
      console.log("Database unavailable, wait 3 seconds");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
const start = async () => {
  try {
    await dbConnection();
    app.listen(config.PORT, async () =>
      console.log(`Server listening on ${config.PORT}`),
    );
  } catch (e) {
    console.log(e);
  }
};

start();
