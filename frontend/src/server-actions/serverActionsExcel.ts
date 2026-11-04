"use server"

import {IOrderQuery} from "@/interfaces/IOrderQuery";
import {IOrder} from "@/interfaces/IOrder";
import {orderService} from "@/api-services/order.api";

export const loadOrdersForExcel = async (query: IOrderQuery): Promise<IOrder[]> => {
    return await orderService.getAllForExcel(query);
}