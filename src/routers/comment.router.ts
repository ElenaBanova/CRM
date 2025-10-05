import { Router } from "express";

import { commentController } from "../controllers/comment.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { CommentValidator } from "../validators/comment.validator";

const router = Router();

router.get(
  "/",
  commonMiddleware.query(CommentValidator.query),
  commentController.getAll,
);
router.post(
  "/:idUser/:idApplication",
  commonMiddleware.isIdValidate("idUser"),
  commonMiddleware.isIdValidate("idApplication"),
  commonMiddleware.managerValid("idApplication"),
  commonMiddleware.validateBody(CommentValidator.create),
  commentController.create,
);

export const commentRouter = router;
