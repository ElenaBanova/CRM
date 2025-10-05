import { Router } from "express";

import { applicationController } from "../controllers/application.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ApplicationValidator } from "../validators/application.validator";

const router = Router();

router.get("/", applicationController.getAll);
router.post(
  "/",
  commonMiddleware.validateBody(ApplicationValidator.create),
  applicationController.create,
);
router.get(
  "/:id",
  commonMiddleware.isIdValidate("id"),
  applicationController.getById,
);
router.patch(
  "/:id",
  commonMiddleware.isIdValidate("id"),
  commonMiddleware.managerValid("id"),
  commonMiddleware.validateBody(ApplicationValidator.update),
  applicationController.updateById,
);

export const applicationRouter = router;
