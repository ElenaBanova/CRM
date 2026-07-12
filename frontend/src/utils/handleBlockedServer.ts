import {AxiosError} from "axios";
import {isBlockedUser} from "@/utils/isBlockedUser";
import {redirect} from "next/navigation";

export async function handleBlockedServer(error: AxiosError) {
    if (!isBlockedUser(error)) return;

    redirect("/login");
}