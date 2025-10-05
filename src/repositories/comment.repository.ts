import { FilterQuery } from "mongoose";

import {
  IComment,
  ICommentCreate,
  ICommentQuery,
} from "../interfaces/comment.interface";
import { Comment } from "../models/coment.model";

class CommentRepository {
  public getAll(query: ICommentQuery): Promise<IComment[]> {
    const filterObject: FilterQuery<IComment> = {};

    if (query._idApplication) {
      filterObject._idApplication = {
        $regex: query._idApplication,
        $options: "i",
      };
    }
    return Comment.find(filterObject);
  }
  public create(comment: ICommentCreate): Promise<IComment> {
    return Comment.create(comment);
  }
}

export const commentRepository = new CommentRepository();
