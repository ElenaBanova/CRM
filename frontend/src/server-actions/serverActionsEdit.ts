"use server"

import {orderValidatorSchema} from "@/validators/order.validator";
import {axiosServer} from "@/api-services/api.services";
import {urls} from "@/constants/urls";
import {IOrderPromise} from "@/interfaces/IOrder";
import {IOrderUpdate} from "@/interfaces/IOrderUpdate";

type OrderFormFields = 'group' | 'name' | 'surname' | 'email' | 'phone' |
    'age' | 'status' | 'sum' | 'already_paid' |
    'course' | 'course_format' | 'course_type';

const orderEdit = async (prevState: unknown, formData: FormData) => {
    const id = formData.get('id') as string;

    const data: Record<OrderFormFields, FormDataEntryValue | null> = {
        group: formData.get('group') || null,
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        status: formData.get('status') || null,
        sum: formData.get('sum'),
        already_paid: formData.get('already_paid'),
        course: formData.get('course') || null,
        course_format: formData.get('course_format') || null,
        course_type: formData.get('course_type') || null,
    }

    const cleanedData: IOrderUpdate = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => {
            return value !== '' && value != null;
        })
    );

    const {error} = orderValidatorSchema.validate(cleanedData, {
        abortEarly: false,
        allowUnknown: true
    });

    if (error) {
        const errorsByField: Record<string, string> = {};

        error.details.forEach((err) => {
            const path = err.path[0] as OrderFormFields;
            if (data[path] !== undefined && data[path] !== '') {
                errorsByField[path] = err.message;
            }
        });

        return {errors: errorsByField, values: cleanedData, success: false};
    }

    try {
        await axiosServer.patch<IOrderPromise>(urls.orders + "/" + id, data)
        return {success: true}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return {error: 'Unable to save changes, data entered incorrectly.', values: cleanedData, success: false};
    }
}

export default orderEdit;