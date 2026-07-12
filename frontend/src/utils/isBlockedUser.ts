import {AxiosError} from "axios";

interface IApiErrorResponse {
    status: number;
    message: string;
}

export function isBlockedUser(error: AxiosError) {
    return (
        error.response?.status === 403 &&
        (error.response.data as IApiErrorResponse)?.message === "Account is blocked"
    );
}