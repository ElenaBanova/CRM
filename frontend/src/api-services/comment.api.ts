import {urls} from "@/constants/urls";
import {IComment, ICommentResponse} from "@/interfaces/IComment";
import {axiosClient} from "@/api-services/api.services";
import {userService} from "@/api-services/user.api";


const commentService = {
    async getAll(orderId: string): Promise<IComment[]> {
        const {data} = await axiosClient.get<IComment[]>(urls.orders + "/" + orderId + "/comments");
        return data;
    },

    async addComment(comment: string, orderId: string): Promise<IComment> {
        const {data} = await axiosClient.post<ICommentResponse>(urls.orders + "/" + orderId, {comment});

        const user = await userService.getByIdClient(`${data._userId}`);

        return {...data, userName: user.name, userSurname: user.surname};
    },
};

export {commentService};