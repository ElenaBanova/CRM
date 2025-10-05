import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getAll);
router.post(
  "/",
  commonMiddleware.validateBody(UserValidator.create),
  userController.create,
);
router.get("/:id", commonMiddleware.isIdValidate("id"), userController.getById);
router.patch(
  "/:id",
  commonMiddleware.isIdValidate("id"),
  commonMiddleware.validateBody(UserValidator.update),
  userController.updateById,
);
router.patch(
  "/:id/role-update",
  commonMiddleware.isIdValidate("id"),
  userController.roleUpdate,
);
router.patch(
  "/:id/block-unblock",
  commonMiddleware.isIdValidate("id"),
  userController.isActiveUpdate,
);
router.delete(
  "/:id",
  commonMiddleware.isIdValidate("id"),
  userController.deleteById,
);

export const userRouter = router;
