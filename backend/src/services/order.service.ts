import { StatusCodesEnum } from "../enums/status-codes.enum";
import { StatusOrdersEnum } from "../enums/status-orders.enum";
import { ApiError } from "../errors/api.errors";
import {
  IOrder,
  IOrderCreate,
  IOrderQuery,
  IOrderUpdate,
  IOrderWithIndex,
} from "../interfaces/order.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { groupRepository } from "../repositories/group.repository";
import { orderRepository } from "../repositories/order.repository";
import { groupService } from "./group.service";

class OrderService {
  public async getAll(
    query: IOrderQuery,
  ): Promise<IPaginatedResponse<IOrderWithIndex>> {
    const group = await groupRepository.getBySelectValue({
      name: query.group,
    });

    const { orders, totalItems } = await orderRepository.getAll({
      ...query,
      group: group?._id || "",
    });

    const totalPages = Math.ceil(totalItems / query.pageSize);
    return {
      totalItems,
      totalPages,
      prevPage: !!(query.page - 1),
      nextPage: query.page + 1 <= totalPages,
      data: orders,
    };
  }

  public getAllForExcel(
    query: Partial<IOrderQuery>,
  ): Promise<IOrderWithIndex[]> {
    return orderRepository.getAllForExcel(query);
  }

  public create(order: IOrderCreate): Promise<IOrder> {
    return orderRepository.create(order);
  }

  public async getById(id: string): Promise<IOrder> {
    const order = await orderRepository.getById(id);

    if (!order) {
      throw new ApiError("Order not found", StatusCodesEnum.NOT_FOUND);
    }

    return order;
  }

  public async updateById(
    id: string,
    orderNew: IOrderUpdate,
    userId: string,
  ): Promise<IOrder> {
    if (orderNew.group) {
      await groupService.getBySelectValue({ _id: orderNew.group });
    }

    const orderInDB = await orderRepository.getById(id);

    if (!orderInDB) {
      throw new ApiError("Order not found", StatusCodesEnum.NOT_FOUND);
    }

    if (orderNew.status !== orderInDB.status) {
      if (orderNew.status === null) {
        return await orderRepository.updateById(id, {
          ...orderNew,
          manager: null,
        });
      } else {
        if (orderNew.status === StatusOrdersEnum.NEW) {
          return await orderRepository.updateById(id, {
            ...orderNew,
            manager: null,
          });
        }
      }
    }

    if (orderInDB.status === StatusOrdersEnum.NEW || !orderInDB.status) {
      return await orderRepository.updateById(id, {
        ...orderNew,
        status: StatusOrdersEnum.IN_WORK,
        manager: userId,
      });
    }

    return await orderRepository.updateById(id, {
      ...orderNew,
    });
  }
}

export const orderService = new OrderService();
