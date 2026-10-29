import {axiosClient, axiosServer} from "@/api-services/api.services";
import {IPaginatedResponseUser, IUser, IUsersResponseApi, IUsersWithStatistic} from "@/interfaces/IUser";
import {urls} from "@/constants/urls";
import {orderService} from "@/api-services/order.api";
import {IOrder, IPaginatedResponseOrder} from "@/interfaces/IOrder";


const userService = {
    async loadManager(page: string): Promise<IPaginatedResponseUser<IUsersWithStatistic>> {
        const pageSize = 10;
        const params = new URLSearchParams();

        params.append("pageSize", pageSize.toString());
        params.append("page", page);

        const url = `${urls.users}?${params.toString()}`;

        const {data} = await axiosServer.get<IPaginatedResponseUser<IUsersWithStatistic>>(url);

        const enrichedData= await Promise.all(
            data.data
                // .filter(user => user.role === 'manager')
                .map(async (user) => {
                    const statistic = await orderService.getByOrdersStatistic(user._id);
                    return { ...user, statistic };
                })
        );

        return {...data, data: enrichedData};
    },

    async getByIdServer(userId: string): Promise<IUser> {
        const {data: user} = await axiosServer.get<IUser>(urls.users + '/' + userId);
        return user
    },

    async getByIdClient(userId: string): Promise<IUser> {
        const {data: user} = await axiosClient.get<IUser>(urls.users + '/' + userId);
        return user
    },

    async banUnbanManager(userId: string, action: string): Promise<IUser> {
        const {data: user} = await axiosClient.patch<IUser>(urls.users + '/' + userId + '/' + action);
        return user
    }
};

export {userService};
