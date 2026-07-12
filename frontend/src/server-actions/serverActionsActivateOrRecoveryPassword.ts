"use server"

import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {passwordValidatorSchema} from "@/validators/password.validator";
import {redirect} from "next/navigation";

const activateOrRecoveryPassword = async (prevState: unknown, formData: FormData) => {
    const typeAction = formData.get('typeAction');
    const token = formData.get('token');

    const data = {
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    const {error} = passwordValidatorSchema.validate(data);

    if (error) {
        return {error: error.details[0].message, values: data, success: false};
    }

    if (data.password !== data.confirmPassword) {
        return {error: 'Passwords do not match', values: data, success: false};
    }

    try {
        if (typeAction === 'activate') {
            await axiosServer.post<void>(urls.auth.createPassword + "/" + `${token}`, {password: data.password})
        }

        if (typeAction === 'recovery') {
            await axiosServer.post<void>(urls.auth.recoveryPassword + "/" + `${token}`, {password: data.password})
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return {error: 'Unable to save changes, data entered incorrectly.', values: data, success: false};
    }

    redirect('/login');
}

export default activateOrRecoveryPassword;