import { FilterQuery } from "mongoose";

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
        filterObject.status = { $regex: query.status, $options: "i" };
      }
    }
    if (query.group) {
      filterObject.group = query.group;
    }
    if (query.created_at) {
      filterObject.created_at = { $regex: query.created_at, $options: "i" };
    }
    if (query.manager) {
      filterObject.manager = query.manager;
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

    const baseOrderedIds = await Order.find({})
      .sort({ _id: 1 })
      .select("_id")
      .lean();

    const idToRowNumberMap = new Map<string, number>();
    baseOrderedIds.forEach((order, index) => {
      idToRowNumberMap.set(order._id.toString(), index + 1);
    });

    const results = await Promise.all([
      Order.find(filterObject)
        .sort(query.order)
        .skip(skip)
        .limit(query.pageSize)
        .lean(),
      Order.countDocuments(filterObject).exec(),
    ]);

    const orders: IOrderWithIndex[] = results[0].map((order) => ({
      ...order,
      rowNumber: idToRowNumberMap.get(order._id.toString()),
    }));

    return {
      orders,
      totalItems: results[1],
    };
  }

  public async getAllForExcel(
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
        filterObjectExcel.status = { $regex: query.status, $options: "i" };
      }
    }
    if (query.group) {
      filterObjectExcel.group = query.group;
    }
    if (query.created_at) {
      filterObjectExcel.created_at = {
        $regex: query.created_at,
        $options: "i",
      };
    }
    if (query.manager) {
      filterObjectExcel.manager = query.manager;
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

    const baseOrderedIds = await Order.find({})
      .sort({ _id: 1 })
      .select("_id")
      .lean();

    const idToRowNumberMap = new Map<string, number>();
    baseOrderedIds.forEach((order, index) => {
      idToRowNumberMap.set(order._id.toString(), index + 1);
    });

    const results = await Order.find(filterObjectExcel)
      .sort(query.order)
      .lean();

    return results.map((order: IOrder) => ({
      ...order,
      rowNumber: idToRowNumberMap.get(order._id.toString()),
    }));
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
