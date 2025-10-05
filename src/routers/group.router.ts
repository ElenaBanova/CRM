import { Router } from "express";

import { commentController } from "../controllers/comment.controller";
import { groupController } from "../controllers/group.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { GroupValidator } from "../validators/group.validator";

const router = Router();

router.get("/", groupController.getAll);
router.post(
  "/",
  commonMiddleware.validateBody(GroupValidator.create),
  commentController.create,
);

export const commentRouter = router;
