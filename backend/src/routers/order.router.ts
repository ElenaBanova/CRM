import { Router } from "express";

import { commentController } from "../controllers/comment.controller";
import { orderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { CommentValidator } from "../validators/comment.validator";
import { OrderValidator } from "../validators/order.validator";

const router = Router();

router.get(
  "/",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.query(OrderValidator.query),
  orderController.getAll,
);
router.get(
  "/excel",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.query(OrderValidator.queryExcel),
  orderController.getAllForExcel,
);
// router.post(
//   "/",
//   commonMiddleware.validateBody(OrderValidator.create),
//   orderController.create,
// );
router.get(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.isIdValidate("id"),
  orderController.getById,
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.isIdValidate("id"),
  commonMiddleware.managerValid("id"),
  commonMiddleware.validateBody(OrderValidator.update),
  orderController.updateById,
);
router.get(
  "/:id/comments",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.isIdValidate("id"),
  commentController.getAll,
);
router.post(
  "/:id",
  authMiddleware.checkAccessToken,
  authMiddleware.isBlock,
  commonMiddleware.isIdValidate("id"),
  commonMiddleware.managerValid("id"),
  commonMiddleware.validateBody(CommentValidator.create),
  commentController.create,
);

export const orderRouter = router;
