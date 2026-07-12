"use server"

import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {loginValidatorSchema} from "@/validators/manager.validator";
import {IUser} from "@/interfaces/IUser";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return {error: 'Unable to save changes, data entered incorrectly.', values: data, success: false};
    }
}

export default managerCreate;