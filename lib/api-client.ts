import { Like } from "@/models/Like";
import { Playlist } from "@/models/Playlist";
import { User } from "@/models/User";
import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id" | "user">;

export type UserFromData = Pick<User, "userName" | "email" | "password">;

export type LikeFormData = Omit<Like, "like">

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
            // console.log(response);
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


    async verifyCd(userName: string, code: string){
        return this.fetch("verify-code", {
            method: "POST",
            body: {userName, code}
        })
    }


    async forgotPass(email: string){
        return this.fetch("auth/forgotPass", {
            method: "POST",
            body: { email },
        })
    }


    async resendOTP(email: string){
        return this.fetch("auth/resentOTP", {
            method: "POST",
            body: { email },
        })
    }


    async getUser(){
        const response = await this.fetch<{data: User}>("profile/updateInfo");
        return response.data;
    }



    async updateProfile(userName: string, email: string){
        return this.fetch("profile/updateInfo",{
            method: "POST",
            body: { userName, email },
        })
    }



    async updatePass(oldPassword: string, newPassword: string){
        return this.fetch("profile/updatePass", {
            method: "PUT",
            body: {oldPassword, newPassword},
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



    async likeUnlikeVideo(id: string){
        return this.fetch("like-video", {
            method: "POST",
            body: { videoId: id }
        })
    };



    async createComment(id: string, comment: string){
        return this.fetch("comment-video", {
            method: "POST",
            body: {videoId: id, comment},
        })
    };



    async follow(followingId: string){
        return this.fetch("follow", {
            method: "POST",
            body: { followingId }
        })
    };



    async createPlaylist(playlistName: string):Promise<{ data: Playlist }>{
        return this.fetch("playlist", {
            method: "POST",
            body: { playlistName },
        })
    };



    async getPlaylist(){
        const res = await this.fetch<{data: Playlist[]}>("playlist");
        return res.data;
    }



    async deletePlaylist(playlistName: string){
        return this.fetch("playlist", {
            method: "DELETE",
            body: { playlistName },
        })
    };



    async saveVideo(playlistId: string, videoId: string){
        return this.fetch("save-video", {
            method: "POST",
            body: {playlistId, videoId},
        })
    }

    async viewVideo(id: string){
        return this.fetch(`view/${id}`, {
          method: "POST",
        })
    }
    
}

export const apiClient = new ApiClient();