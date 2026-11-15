import { Types } from "mongoose";

import {
  IResponseUsers,
  IUser,
  IUserDTO,
  IUserQuery,
} from "../interfaces/user.interface";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

const statisticFields = {
  total: { $sum: 1 },
  inWork: { $sum: { $cond: [{ $eq: ["$status", "In work"] }, 1, 0] } },
  agree: { $sum: { $cond: [{ $eq: ["$status", "Agree"] }, 1, 0] } },
  disagree: { $sum: { $cond: [{ $eq: ["$status", "Disagree"] }, 1, 0] } },
  dubbing: { $sum: { $cond: [{ $eq: ["$status", "Dubbing"] }, 1, 0] } },
  new: {
    $sum: {
      $cond: [{ $in: [{ $ifNull: ["$status", ""] }, ["New", ""]] }, 1, 0],
    },
  },
};

const emptyStatistic = {
  total: 0,
  inWork: 0,
  agree: 0,
  disagree: 0,
  dubbing: 0,
  new: 0,
};

class UserRepository {
  public async getAll(
    query: IUserQuery,
    currentUserId: string,
  ): Promise<IResponseUsers> {
    const skip = query.pageSize * (query.page - 1);

    const [result, totalStatisticRows] = await Promise.all([
      User.aggregate([
        {
          $setWindowFields: {
            sortBy: { _id: 1 },
            output: { rowNumber: { $documentNumber: {} } },
          },
        },
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
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: Number(query.pageSize) },
              {
                $lookup: {
                  from: "orders",
                  let: { uid: "$_id" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$manager", "$$uid"] } } },
                    { $group: { _id: null, ...statisticFields } },
                    { $project: { _id: 0 } },
                  ],
                  as: "statistic",
                },
              },
              {
                $lookup: {
                  from: "tokens",
                  let: { uid: "$_id" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_userId", "$$uid"] } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                    { $project: { _id: 0, createdAt: 1 } },
                  ],
                  as: "lastToken",
                },
              },
              {
                $addFields: {
                  statistic: {
                    $ifNull: [
                      { $arrayElemAt: ["$statistic", 0] },
                      emptyStatistic,
                    ],
                  },
                  lastLogin: {
                    $ifNull: [
                      { $arrayElemAt: ["$lastToken.createdAt", 0] },
                      null,
                    ],
                  },
                },
              },
              { $project: { password: 0, isMe: 0, lastToken: 0 } },
            ],
            total: [{ $count: "count" }],
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: null, ...statisticFields } },
        { $project: { _id: 0 } },
      ]),
    ]);

    return {
      users: result[0].data,
      totalItems: result[0].total[0]?.count ?? 0,
      totalStatistic: totalStatisticRows[0] ?? emptyStatistic,
    };
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
