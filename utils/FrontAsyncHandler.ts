import { ApiError } from "@/utils/ApiError";
import toast from "react-hot-toast";

export const asyncHandlerFront = async <T>(
    fn: () => Promise<T>,
    onError?: (error: ApiError) => void
) => {
    try {
        return await fn();
    } catch (error:any) {
        if (error instanceof ApiError) {
            onError?.(error);
        } else {
            const message = error?.response?.message || "Something went wrong";
            toast.error(`${message}`);
        }
    }
};