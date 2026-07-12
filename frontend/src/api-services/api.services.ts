import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import {getCookie} from "@/api-services/helper";
import {handleBlockedServer} from "@/utils/handleBlockedServer";
import {handleBlockedClient} from "@/utils/handleBlockedClient";

const addAuthToken = async (reqObj: InternalAxiosRequestConfig) => {
    const token = await getCookie("accessToken");

    if (token) {
        reqObj.headers.Authorization = `Bearer ${token}`;
    }

    return reqObj;
};

const createErrorInterceptor =
    (handler: (error: AxiosError) => Promise<void>) =>
        async (error: AxiosError) => {
            await handler(error);

            if (error.request && !error.response) {
                console.error("No response:", error.request);
            } else if (!error.request) {
                console.error("Error:", error.message);
            }

            return Promise.reject(error);
        };

export const axiosServer = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {'Content-Type': 'application/json'},
})

axiosServer.interceptors.request.use(addAuthToken);

axiosServer.interceptors.response.use(
    response => response,
    createErrorInterceptor(handleBlockedServer)
);

export const axiosClient = axios.create({
    baseURL: "/api",
    headers: {'Content-Type': 'application/json'},
})

axiosClient.interceptors.request.use(addAuthToken);

axiosClient.interceptors.response.use(
    response => response,
    createErrorInterceptor(handleBlockedClient)
);

