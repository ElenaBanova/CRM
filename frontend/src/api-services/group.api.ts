import {axiosClient, axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {IGroup} from "@/interfaces/IGroup";

const groupService = {
    async loadGroups(): Promise<IGroup[]> {
        const {data} = await axiosServer.get<IGroup[]>(urls.groups);
        return data;
    },

    async createGroup(group: string): Promise<IGroup> {
        const {data} = await axiosClient.post<IGroup>(urls.groups, {name: group});
        return data
    },

    async getByIdGroup(id: string): Promise<IGroup> {
        const {data} = await axiosServer.get<IGroup>(urls.groups +"/" + id);
        return data
    }
};

export {groupService};