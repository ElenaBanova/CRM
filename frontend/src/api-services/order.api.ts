import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {IOrder, IOrderPromise, IPaginatedResponseOrder} from "@/interfaces/IOrder";
import {IOrderQuery} from "@/interfaces/IOrderQuery";


const orderService = {
    async getAll(page: string, query?: IOrderQuery): Promise<IPaginatedResponseOrder<IOrder>> {
        const pageSize = 25;
        const params = new URLSearchParams();

        params.append("pageSize", pageSize.toString());
        params.append("page", page);

        if (query) {
            if (query.order !== undefined) params.append("order", query.order);
            if (query.name !== undefined) params.append("name", query.name);
            if (query.surname !== undefined) params.append("surname", query.surname);
            if (query.email !== undefined) params.append("email", query.email);
            if (query.phone !== undefined) params.append("phone", query.phone);
            if (query.age !== undefined) params.append("age", query.age);
            if (query.course !== undefined) params.append("course", query.course);
            if (query.course_format !== undefined) params.append("course_format", query.course_format.toLowerCase());
            if (query.course_type !== undefined) params.append("course_type", query.course_type.toLowerCase());
            if (query.status !== undefined) params.append("status", query.status);
            if (query.group !== undefined) params.append("group", query.group);
            if (query.manager !== undefined) params.append("manager", query.manager);
            if (query.dateFrom !== undefined) params.append("dateFrom", query.dateFrom);
            if (query.dateTo !== undefined) params.append("dateTo", query.dateTo);
        }

        const url = `${urls.orders}?${params.toString()}`;
        const {data} = await axiosServer.get<IPaginatedResponseOrder<IOrder>>(url);

        return data;
    },

    async getAllForExcel(queryExcel?: IOrderQuery): Promise<IOrder[]> {
        const params = new URLSearchParams();

        if (queryExcel) {
            if (queryExcel.order !== undefined) params.append("order", queryExcel.order);
            if (queryExcel.name !== undefined) params.append("name", queryExcel.name);
            if (queryExcel.surname !== undefined) params.append("surname", queryExcel.surname);
            if (queryExcel.email !== undefined) params.append("email", queryExcel.email);
            if (queryExcel.phone !== undefined) params.append("phone", queryExcel.phone);
            if (queryExcel.age !== undefined) params.append("age", queryExcel.age);
            if (queryExcel.course !== undefined) params.append("course", queryExcel.course);
            if (queryExcel.course_format !== undefined) params.append("course_format", queryExcel.course_format.toLowerCase());
            if (queryExcel.course_type !== undefined) params.append("course_type", queryExcel.course_type.toLowerCase());
            if (queryExcel.status !== undefined) params.append("status", queryExcel.status);
            if (queryExcel.group !== undefined) params.append("group", queryExcel.group);
            if (queryExcel.manager !== undefined) params.append("manager", queryExcel.manager);
            if (queryExcel.dateFrom !== undefined) params.append("dateFrom", queryExcel.dateFrom);
            if (queryExcel.dateTo !== undefined) params.append("dateTo", queryExcel.dateTo);
        }

        const urlExcel = `${urls.orders}/excel?${params.toString()}`;
        const data = await axiosServer.get<IOrder[]>(urlExcel);

        return data.data;
    },

    async getById(id: string): Promise<IOrderPromise> {
        const {data} = await axiosServer.get<IOrderPromise>(urls.orders + '/' + id);
        return data;
    },
}

export {orderService};