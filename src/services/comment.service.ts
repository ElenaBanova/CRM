import { StatusApplicationsEnum } from "../enums/status-applications.enum";
import {
  IComment,
  ICommentCreate,
  ICommentQuery,
} from "../interfaces/comment.interface";
import { commentRepository } from "../repositories/comment.repository";
import { applicationService } from "./application.service";

class CommentService {
  public getAll(query: ICommentQuery): Promise<IComment[]> {
    return commentRepository.getAll(query);
  }

  public async create(commentNew: ICommentCreate): Promise<IComment> {
    const comment = await commentRepository.create(commentNew);
    const { status } = await applicationService.getById(comment._idApplication);

    if (!status || status === StatusApplicationsEnum.NEW) {
      await applicationService.updateById(comment._idApplication, {
        status: StatusApplicationsEnum.IN_WORK,
      });
    }
    await applicationService.updateById(comment._idApplication, {
      manager: comment._userId,
    });
    return comment;
  }
}

export const commentService = new CommentService();
