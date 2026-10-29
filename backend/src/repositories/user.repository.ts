import { Types } from "mongoose";

import {
  IResponseUsers,
  IUser,
  IUserDTO,
  IUserQuery,
} from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(
    query: IUserQuery,
    currentUserId: string,
  ): Promise<IResponseUsers> {
    const skip = query.pageSize * (query.page - 1);
    const baseUsedIds = await User.find({})
      .sort({ _id: 1 })
      .select("_id")
      .lean();

    const idToRowNumberMap = new Map<string, number>();
    baseUsedIds.forEach((user, index) => {
      idToRowNumberMap.set(user._id.toString(), index + 1);
    });

    const [rawUsers, totalItems] = await Promise.all([
      User.aggregate([
        {
          $addFields: {
            isMe: {
              $cond: [
                { $eq: ["$_id", new Types.ObjectId(currentUserId)] },
                0,
                1,
              ],
            },
          },
        },
        { $sort: { isMe: 1, _id: -1 } },
        { $skip: skip },
        { $limit: Number(query.pageSize) },
        { $project: { password: 0, isMe: 0 } },
      ]),
      User.countDocuments().exec(),
    ]);

    const usersWithRowNumber = rawUsers.map((user) => ({
      ...user,
      rowNumber: idToRowNumberMap.get(user._id.toString()),
    }));

    return { users: usersWithRowNumber, totalItems };
  }

  public create(user: IUserDTO): Promise<IUser> {
    return User.create(user);
  }

  public getById(id: string): Promise<IUser> {
    return User.findById(id);
  }

  public updateById(id: string, user: Partial<IUser>): Promise<IUser> {
    return User.findByIdAndUpdate(id, user, { new: true });
  }

  public getByEmail(email: string): Promise<IUser> {
    return User.findOne({ email });
  }
}

export const userRepository = new UserRepository();
