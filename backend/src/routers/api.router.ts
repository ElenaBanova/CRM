import { Router } from "express";

import { authRouter } from "./auth.router";
import { groupRouter } from "./group.router";
import { orderRouter } from "./order.router";
import { userRouter } from "./user.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/groups", groupRouter);
router.use("/orders", orderRouter);

export const apiRouter = router;
