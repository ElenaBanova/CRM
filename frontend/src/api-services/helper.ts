'use server'

import {cookies} from "next/headers";

const setCookie = async (key: string, token: string): Promise<void> => {
    if (key === "accessToken") {
        (await cookies()).set('accessToken', token, {
            httpOnly: true,
            path: '/', maxAge: Number(process.env.ACCESS_LIFETIME)
        });
    }
    if (key === "refreshToken") {
        (await cookies()).set('refreshToken', token, {
            httpOnly: true,
            path: '/'
        });
    }
}

const getCookie = async (key: string): Promise<string> => {
    return (await cookies()).get(key)?.value || '';
}

const deleteCookies = async (): Promise<void> => {
    (await cookies()).delete('refreshToken');
    (await cookies()).delete('accessToken');
}

export {setCookie, getCookie, deleteCookies};


