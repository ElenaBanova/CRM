import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  authMiddleware.isAdmin,
  userController.getAll,
);
router.post(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  authMiddleware.isAdmin,
  commonMiddleware.validateBody(UserValidator.create),
  userController.create,
);
router.get(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  // authMiddleware.isAdmin,
  commonMiddleware.isIdValidate("id"),
  userController.getById,
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  authMiddleware.isAdmin,
  commonMiddleware.isIdValidate("id"),
  commonMiddleware.validateBody(UserValidator.update),
  userController.updateById,
);
router.patch(
  "/:id/role-update",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  authMiddleware.isAdmin,
  commonMiddleware.isIdValidate("id"),
  userController.roleUpdate,
);
router.patch(
  "/:id/block-unblock",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  authMiddleware.isAdmin,
  commonMiddleware.isIdValidate("id"),
  userController.blockUnblockUser,
);

export const userRouter = router;
