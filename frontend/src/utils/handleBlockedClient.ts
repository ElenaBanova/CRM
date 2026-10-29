import {isBlockedUser} from "@/utils/isBlockedUser";
import {AxiosError} from "axios";
import {toast} from "sonner";

export async function handleBlockedClient(error: AxiosError) {
    if (!isBlockedUser(error)) return;

    window.location.replace("/login");
}

export async function handleServerErrorClient(error: AxiosError) {
    const status = error.response?.status;

    if (!error.response || (status && status >= 500)) {
        toast.error("Something went wrong. Please contact the administrator.", {
            id: "server-error",
        });
    }
}