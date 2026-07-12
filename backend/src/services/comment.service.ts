import { StatusOrdersEnum } from "../enums/status-orders.enum";
import {
  IComment,
  ICommentAggregate,
  ICommentCreate,
} from "../interfaces/comment.interface";
import { commentRepository } from "../repositories/comment.repository";
import { orderService } from "./order.service";

class CommentService {
  public async getAll(id: string): Promise<ICommentAggregate[]> {
    await orderService.getById(id);

    return await commentRepository.getAll(id);
  }

  public async create(commentNew: ICommentCreate): Promise<IComment> {
    const comment = await commentRepository.create(commentNew);
    const { status } = await orderService.getById(comment._idOrder);

    if (!status || status === StatusOrdersEnum.NEW) {
      await orderService.updateById(
        comment._idOrder,
        {
          status: StatusOrdersEnum.IN_WORK,
        },
        comment._userId,
      );
    }

    return comment;
  }
}

export const commentService = new CommentService();
