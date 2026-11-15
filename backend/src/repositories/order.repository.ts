import { FilterQuery, Types } from "mongoose";

import {
  IOrder,
  IOrderCreate,
  IOrderQuery,
  IOrderUpdate,
  IOrderWithIndex,
  IResponseOrders,
} from "../interfaces/order.interface";
import { Order } from "../models/order.model";

class OrderRepository {
  private sortStage(order: string = "-_id"): Record<string, 1 | -1> {
    const desc = order.startsWith("-");
    return { [desc ? order.slice(1) : order]: desc ? -1 : 1 };
  }

  private lookups = [
    {
      $lookup: {
        from: "users",
        localField: "manager",
        foreignField: "_id",
        as: "m",
      },
    },
    {
      $lookup: {
        from: "groups",
        localField: "group",
        foreignField: "_id",
        as: "g",
      },
    },
    {
      $addFields: {
        managerInfo: {
          $trim: {
            input: {
              $concat: [
                { $ifNull: [{ $arrayElemAt: ["$m.name", 0] }, ""] },
                " ",
                { $ifNull: [{ $arrayElemAt: ["$m.surname", 0] }, ""] },
              ],
            },
          },
        },
        groupName: { $ifNull: [{ $arrayElemAt: ["$g.name", 0] }, ""] },
      },
    },
    { $project: { m: 0, g: 0 } },
  ];

  public async getAll(query: IOrderQuery): Promise<IResponseOrders> {
    const skip = query.pageSize * (query.page - 1);
    const filterObject: FilterQuery<IOrder> = {};
    const escapeRegex = (item: string) => {
      return item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    if (query.name) {
      filterObject.name = { $regex: escapeRegex(query.name), $options: "i" };
    }
    if (query.surname) {
      filterObject.surname = {
        $regex: escapeRegex(query.surname),
        $options: "i",
      };
    }
    if (query.phone) {
      filterObject.phone = { $regex: escapeRegex(query.phone), $options: "i" };
    }
    if (query.email) {
      filterObject.email = { $regex: escapeRegex(query.email), $options: "i" };
    }
    if (query.age || query.age === 0) {
      filterObject.age = query.age;
    }
    if (query.course) {
      filterObject.course = { $regex: query.course, $options: "i" };
    }
    if (query.course_format) {
      filterObject.course_format = {
        $regex: query.course_format,
        $options: "i",
      };
    }
    if (query.course_type) {
      filterObject.course_type = { $regex: query.course_type, $options: "i" };
    }
    if (query.status) {
      if (query.status === "New") {
        filterObject.$or = [
          { status: { $regex: query.status, $options: "i" } },
          { status: null },
          { status: "" },
        ];
      } else {
        filterObject.status = { $regex: `^${query.status}$`, $options: "i" };
      }
    }
    if (query.group) {
      filterObject.group = new Types.ObjectId(query.group);
    }
    if (query.created_at) {
      filterObject.created_at = { $regex: query.created_at, $options: "i" };
    }
    if (query.manager) {
      filterObject.manager = new Types.ObjectId(query.manager);
    }
    if (query.dateFrom || query.dateTo) {
      filterObject.created_at = {};
      if (query.dateFrom) {
        filterObject.created_at.$gte = `${query.dateFrom.slice(0, 10)}T00:00:00Z`;
      }
      if (query.dateTo) {
        filterObject.created_at.$lte = `${query.dateTo.slice(0, 10)}T23:59:59Z`;
      }
    }

    const [result] = await Order.aggregate([
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: { rowNumber: { $documentNumber: {} } },
        },
      },
      { $match: filterObject },
      { $sort: this.sortStage(query.order) },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(query.pageSize) },
            ...this.lookups,
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    return { orders: result.data, totalItems: result.total[0]?.count ?? 0 };
  }

  public getAllForExcel(
    query: Partial<IOrderQuery>,
  ): Promise<IOrderWithIndex[]> {
    const filterObjectExcel: FilterQuery<IOrder> = {};
    const escapeRegex = (item: string) => {
      return item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    if (query.name) {
      filterObjectExcel.name = {
        $regex: escapeRegex(query.name),
        $options: "i",
      };
    }
    if (query.surname) {
      filterObjectExcel.surname = {
        $regex: escapeRegex(query.surname),
        $options: "i",
      };
    }
    if (query.phone) {
      filterObjectExcel.phone = {
        $regex: escapeRegex(query.phone),
        $options: "i",
      };
    }
    if (query.email) {
      filterObjectExcel.email = {
        $regex: escapeRegex(query.email),
        $options: "i",
      };
    }
    if (query.age || query.age === 0) {
      filterObjectExcel.age = query.age;
    }
    if (query.course) {
      filterObjectExcel.course = { $regex: query.course, $options: "i" };
    }
    if (query.course_format) {
      filterObjectExcel.course_format = {
        $regex: query.course_format,
        $options: "i",
      };
    }
    if (query.course_type) {
      filterObjectExcel.course_type = {
        $regex: query.course_type,
        $options: "i",
      };
    }
    if (query.status) {
      if (query.status === "New") {
        filterObjectExcel.$or = [
          { status: { $regex: query.status, $options: "i" } },
          { status: null },
          { status: "" },
        ];
      } else {
        filterObjectExcel.status = {
          $regex: `^${query.status}$`,
          $options: "i",
        };
      }
    }
    if (query.group) {
      filterObjectExcel.group = new Types.ObjectId(query.group);
    }
    if (query.created_at) {
      filterObjectExcel.created_at = {
        $regex: query.created_at,
        $options: "i",
      };
    }
    if (query.manager) {
      filterObjectExcel.manager = new Types.ObjectId(query.manager);
    }
    if (query.dateFrom || query.dateTo) {
      filterObjectExcel.created_at = {};
      if (query.dateFrom) {
        filterObjectExcel.created_at.$gte = `${query.dateFrom.slice(0, 10)}T00:00:00Z`;
      }
      if (query.dateTo) {
        filterObjectExcel.created_at.$lte = `${query.dateTo.slice(0, 10)}T23:59:59Z`;
      }
    }

    return Order.aggregate<IOrderWithIndex>([
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: { rowNumber: { $documentNumber: {} } },
        },
      },
      { $match: filterObjectExcel },
      { $sort: this.sortStage(query.order) },
      ...this.lookups,
    ]).exec();
  }

  public create(order: IOrderCreate): Promise<IOrder> {
    return Order.create(order);
  }

  public getById(id: string): Promise<IOrder> {
    return Order.findById(id);
  }

  public updateById(id: string, order: IOrderUpdate): Promise<IOrder> {
    return Order.findByIdAndUpdate(id, order, { new: true });
  }
}

export const orderRepository = new OrderRepository();
