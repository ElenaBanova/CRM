import {isBlockedUser} from "@/utils/isBlockedUser";
import {AxiosError} from "axios";

export async function handleBlockedClient(error: AxiosError) {
    if (!isBlockedUser(error)) return;

    window.location.replace("/login");
}