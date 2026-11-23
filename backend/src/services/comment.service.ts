import { StatusOrdersEnum } from "../enums/status-orders.enum";
import {
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

  public async create(commentNew: ICommentCreate): Promise<ICommentAggregate> {
    const order = await orderService.getById(commentNew._idOrder);
    orderService.assertCanModify(order, commentNew._userId);

    const comment = await commentRepository.create(commentNew);

    if (!order.status || order.status === StatusOrdersEnum.NEW) {
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
