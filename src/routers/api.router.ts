import { Router } from "express";

import { applicationRouter } from "./application.router";
import { authRouter } from "./auth.router";
import { commentRouter } from "./comment.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/comments", commentRouter);
router.use("/groups", commentRouter);
router.use("/application", applicationRouter);

export const apiRouter = router;
