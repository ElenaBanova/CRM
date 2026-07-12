import { Router } from "express";

import { groupController } from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { GroupValidator } from "../validators/group.validator";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  groupController.getAll,
);
router.post(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.validateBody(GroupValidator.create),
  groupController.create,
);
router.get(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.isIdValidate("id"),
  groupController.getById,
);

export const groupRouter = router;
