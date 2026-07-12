"use server"

import {urls} from "@/constants/urls";
import {revalidatePath} from "next/cache";

export const ordersPageAction = async () => {
    const params = new URLSearchParams();
    const url = `${urls.orders}?${params.toString()}`;
    revalidatePath(url);
}