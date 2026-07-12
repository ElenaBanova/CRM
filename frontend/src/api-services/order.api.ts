import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {IOrder, IOrderPromise, IPaginatedResponseOrder} from "@/interfaces/IOrder";
import {IOrderQuery} from "@/interfaces/IOrderQuery";
import {userService} from "@/api-services/user.api";
import {IStatistic} from "@/interfaces/IStatistic";
import {groupService} from "@/api-services/group.api";


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
        }

        const url = `${urls.orders}?${params.toString()}`;
        const {data} = await axiosServer.get<IPaginatedResponseOrder<IOrder>>(url);

        const enrichedData = await Promise.all(data.data.map(async (order) => {
            if (!order.manager) return order;

            try {
                const user = await userService.getByIdServer(order.manager);
                return {...order, managerInfo: `${user.name} ${user.surname}`};
            } catch {
                return {...order, managerInfo: ''};
            }
        }));

        return {...data, data: enrichedData};
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
        }

        const urlExcel = `${urls.orders}/excel?${params.toString()}`;
        const data = await axiosServer.get<IOrder[]>(urlExcel);

        return await Promise.all(data.data.map(async (order) => {
            if (!order.manager && !order.group) return order;

            const group = await groupService.getByIdGroup(order.group);
            const user = await userService.getByIdServer(order.manager);
            return {...order, group: group?.name || '', managerInfo: `${user?.name} ${user?.surname}` || ''};
        }));
    },

    async getById(id: string): Promise<IOrderPromise> {
        const {data} = await axiosServer.get<IOrderPromise>(urls.orders + '/' + id);
        return data;
    },

    async getByOrdersStatistic(managerId?: string): Promise<IStatistic> {
        let data: IOrder[] = [];

        if (managerId) {
            const params = new URLSearchParams();
            params.append("order", '-_id');
            params.append("manager", managerId);

            const urlExcel = `${urls.orders}/excel?${params.toString()}`;
            const {data: orders} = await axiosServer.get<IOrder[]>(urlExcel);
            data = orders;
        } else {
            const {data: orders} = await axiosServer.get<IOrder[]>(urls.orders + "/excel");
            data = orders;
        }

        const total = data?.length || 0;
        const inWork = data?.filter((order) => order.status === 'In work').length || 0;
        const agree = data?.filter((order) => order.status === 'Agree').length || 0;
        const disagree = data?.filter((order) => order.status === 'Disagree').length || 0;
        const dubbing = data?.filter((order) => order.status === 'Dubbing').length || 0;
        const newStatus = data?.filter((order) => order.status === 'New').length || 0;
        const nullStatus = data?.filter((order) => order.status === null).length || 0;

        return {
            total: total,
            inWork: inWork,
            agree: agree,
            disagree: disagree,
            dubbing: dubbing,
            new: newStatus + nullStatus,
        };
    }
    // async updateById(id: string, order: IOrderUpdate): Promise<IOrderPromise> {
    //     const {data} = await axiosServer.post<IOrderPromise>(urls.orders + "/" + id, order)
    //     return data
    // }
}

export {orderService};