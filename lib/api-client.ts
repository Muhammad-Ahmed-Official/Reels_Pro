import { User } from "@/models/User";
import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id" | "user">;

export type UserFromData = Pick<User, "userName" | "email" | "password">;

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient{
    private async fetch<T>( endPoint: string, options: FetchOptions = {} ) : Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json", 
            ...headers,
        };

        const response = await fetch(`/api/${endPoint}`, {
            method, 
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if(!response.ok){
            console.log(response);
            throw new Error(await response.text());
        } 

        return response.json()
    }

    
    async register(userData: UserFromData){
        return this.fetch("auth/register", {
            method: "POST",
            body: userData,
        })
    }



    async getVideos() {
        const res = await this.fetch<{data: IVideo[]}>("videos");
        return res.data;
    };



    async createVideo(videoData: VideoFormData){
        return this.fetch("videos", {
            method: "POST",
            body: videoData
        });
    };
    
}

export const apiClient = new ApiClient();