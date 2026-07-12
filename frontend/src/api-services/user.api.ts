import {axiosClient, axiosServer} from "@/api-services/api.services";
import {IUser, IUsersResponseApi, IUsersWithStatistic} from "@/interfaces/IUser";
import {urls} from "@/constants/urls";
import {orderService} from "@/api-services/order.api";


const userService = {
    async loadManager(): Promise<IUsersWithStatistic[]> {
        const {data} = await axiosServer.get<IUsersResponseApi[]>(urls.users);
        return await Promise.all(
            data
                .filter(user => user.role === 'manager')
                .map(async (user) => {
                    const statistic = await orderService.getByOrdersStatistic(user._id);
                    return { ...user, statistic };
                })
        );
    },

    async getByIdServer(userId: string): Promise<IUser> {
        const {data: user} = await axiosServer.get<IUser>(urls.users + '/' + userId);
        return user
    },

    async getByIdClient(userId: string): Promise<IUser> {
        const {data: user} = await axiosClient.get<IUser>(urls.users + '/' + userId);
        return user
    },

    async banUnbanManager(userId: string): Promise<IUser> {
        console.log(userId)
        const {data: user} = await axiosClient.patch<IUser>(urls.users + '/' + userId + '/' + 'block-unblock');
        return user
    }
};

export {userService};
