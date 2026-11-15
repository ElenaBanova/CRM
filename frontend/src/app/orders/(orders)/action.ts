"use server"

import {urls} from "@/constants/urls";
import {revalidatePath} from "next/cache";

export const ordersPageAction = async () => {
    revalidatePath(urls.orders);
}