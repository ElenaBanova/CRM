'use server'

import {IUserWithTokens} from "@/interfaces/IUserWithTokens";
import {axiosServer} from "@/api-services/api.services";
import {loginValidatorSchema} from "@/validators/login.validator";
import {urls} from "@/constants/urls";
import {setCookie} from "@/api-services/helper";
import {redirect} from "next/navigation";
import {isRedirectError} from "@/utils/isRedirectError";
import {AxiosError} from "axios";


const loginUser = async (prevState: unknown, formData: FormData) => {
        const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const {error} = loginValidatorSchema.validate(data)

    if (error) {
        return {error: error.details[0].message}
    }

    try {
        const {data: {tokens: tokens}} = await axiosServer.post<IUserWithTokens>(urls.auth.login, {
            email: data.email,
            password: data.password,
        });

        await setCookie('accessToken', tokens.accessToken);
        await setCookie('refreshToken', tokens.refreshToken);

        // return {success: true}

    } catch (e) {
        if (isRedirectError(e)) throw e;

        const status = (e as AxiosError).response?.status;
        const message = (e as AxiosError<{ message?: string }>).response?.data?.message;

        if (!status || status >= 500) {
            return {
                error: "Server error. Please try again later or contact the administrator.",
                values: data,
                success: false,
            };
        }

        if (status === 403 && message === "Account is blocked") {
            return {error: "Your account has been blocked. Please contact the administrator."};
        }

        return {error: 'Invalid email or password'};
    }

    redirect('/orders?page=1&order=-_id')
}

export default loginUser;


