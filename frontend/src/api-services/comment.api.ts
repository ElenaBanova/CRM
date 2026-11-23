import {urls} from "@/constants/urls";
import {IComment} from "@/interfaces/IComment";
import {axiosClient} from "@/api-services/api.services";


const commentService = {
    async getAll(orderId: string): Promise<IComment[]> {
        const {data} = await axiosClient.get<IComment[]>(urls.orders + "/" + orderId + "/comments");
        return data;
    },

    async addComment(comment: string, orderId: string): Promise<IComment> {
        const {data} = await axiosClient.post<IComment>(urls.orders + "/" + orderId, {comment});
        return data;
    },
};

export {commentService};