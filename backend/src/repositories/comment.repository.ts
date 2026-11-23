import { FilterQuery, Types } from "mongoose";

import {
  IComment,
  ICommentAggregate,
  ICommentCreate,
} from "../interfaces/comment.interface";
import { Comment } from "../models/coment.model";

class CommentRepository {
  private getCommentAggregation() {
    return [
      {
        $lookup: {
          from: "users",
          localField: "_userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          comment: 1,
          _userId: 1,
          userName: { $ifNull: ["$user.name", ""] },
          userSurname: { $ifNull: ["$user.surname", ""] },
          _idOrder: 1,
          createdAt: 1,
        },
      },
    ];
  }

  public getAll(id: string): Promise<ICommentAggregate[]> {
    const filterObject: FilterQuery<IComment> = {};
    if (id) {
      filterObject._idOrder = new Types.ObjectId(id);
    }
    return Comment.aggregate([
      {
        $match: filterObject,
      },
      ...this.getCommentAggregation(),
    ]);
  }

  public async create(comment: ICommentCreate): Promise<ICommentAggregate> {
    const createdComment = await Comment.create(comment);

    const [result] = await Comment.aggregate<ICommentAggregate>([
      {
        $match: { _id: createdComment._id },
      },
      ...this.getCommentAggregation(),
    ]);

    return result;
  }
}

export const commentRepository = new CommentRepository();
