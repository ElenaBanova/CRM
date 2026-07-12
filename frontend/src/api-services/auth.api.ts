import {IUser} from "@/interfaces/IUser";
import {axiosClient, axiosServer,} from "@/api-services/api.services";
import {urls} from "@/constants/urls";


const authService = {
    async me(): Promise<IUser> {
        const {data} = await axiosClient.get<IUser>(urls.auth.me);
        return data;
    },

    async meServer(): Promise<IUser> {
        const {data} = await axiosServer.get<IUser>(urls.auth.me);
        return data;
    },

    async userActivateURL(id:string): Promise<string> {
        const {data} = await axiosServer.post<string>(urls.auth.activateURL + '/' + id);
        return data
    },

    async userRecoveryURL(id: string): Promise<string> {
        const {data} = await axiosServer.post<string>(urls.auth.recoveryURL + '/' + id);
        return data
    }
}
export {authService}