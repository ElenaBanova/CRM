import {AxiosError} from "axios";
import {urls} from "@/constants/urls";

interface IApiErrorResponse {
    status: number;
    message: string;
}

export function isBlockedUser(error: AxiosError) {
    if (error.config?.url?.includes(urls.auth.login)) return false;

    return (
        error.response?.status === 403 &&
        (error.response.data as IApiErrorResponse)?.message === "Account is blocked"
    );
}