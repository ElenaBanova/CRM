import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { AuthValidator } from "../validators/auth.validator";

const router = Router();

router.post(
  "/sign-in",
  commonMiddleware.validateBody(AuthValidator.signIn),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.get("/me", authController.me);
router.post("/activate/:id", authController.actionURL);
router.post("/recovery/:id", authController.actionURL);
router.post(
  "/password/create/:token",
  commonMiddleware.validateBody(AuthValidator.validatePassword),
  authController.passwordCreateOrRecovery,
);
router.post(
  "/password/recovery/:token",
  commonMiddleware.validateBody(AuthValidator.validatePassword),
  authController.passwordCreateOrRecovery,
);

export const authRouter = router;
