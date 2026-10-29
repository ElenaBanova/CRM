"use server"

import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {loginValidatorSchema} from "@/validators/manager.validator";
import {IUser} from "@/interfaces/IUser";
import {isRedirectError} from "@/utils/isRedirectError";
import {AxiosError} from "axios";

const managerCreate = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get('email'),
        name: formData.get('name'),
        surname: formData.get('surname'),

    }

    const {error} = loginValidatorSchema.validate(data);

    if (error) {
        return {error: error.details[0].message, values: data, success: false};
    }

    try {
        await axiosServer.post<IUser>(urls.users + "/", data)
        return {success: true}
    } catch (e) {
        if (isRedirectError(e)) throw e;

        const status = (e as AxiosError).response?.status;

        if (!status || status >= 500) {
            return {
                error: "Server error. Please try again later or contact the administrator.",
                values: data,
                success: false,
            };
        }

        return {error: 'Unable to save changes, data entered incorrectly.', values: data, success: false};
    }
}

export default managerCreate;