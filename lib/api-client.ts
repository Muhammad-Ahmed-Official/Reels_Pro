import { Comment } from "@/models/Comment";
import { Like } from "@/models/Like";
import { Playlist } from "@/models/Playlist";
import { User } from "@/models/User";
import { IVideo } from "@/models/Video";

export type VideosFormData = Omit<IVideo, "_id" | "user" | "views">;

export type UserFromData = Pick<User, "userName" | "email" | "password">;

// export interface IComment {
//   _id: string;
//   text: string;
//   createdAt: string;
//   user: {
//     _id: string;
//     userName: string;
//     profilePic?: string;
//     isVerified?: boolean;
//   };
// }


export type VideoFormData = IVideo & {
    _id: string;
    owner: IUserInfo;
    isLikedVideo?: boolean;
    commentWithUser: Comment[];
    likesCount: number;
    isFollow: boolean;
    isSaved: boolean;
}


export interface IUserInfo {
  _id: string;
  userName: string;
  profilePic: string;
  isVerified?:boolean;
}

export interface IVideoDetail {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  views: number;
  createdAt?: string; 
  owner: IUserInfo;
}


export type PlaylistFormData = Omit<Playlist, "videos"> & {
    user: {
        _id: string;
        userName: string;
        email: string;
    }
    videos: IVideoDetail[];
    // createdAt: Date;
} 



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


    async getVideo(id: string){
        const res = await this.fetch<{data:VideoFormData[]}>(`getVideo?id=${id}`)
        return res.data;
    }


    async getVideos() {
        const res = await this.fetch<{data: IVideo[]}>("videos");
        return res.data;
    };



    async createVideo(videoData: VideosFormData){
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
        return this.fetch("send", {
            method: "POST",
            body: {videoId: id, comment},
        })
    };


    async replyComment(videoId: string, comment: string, parentCommentId: string){
        return  this.fetch("reply", {
            method: "POST",
            body: {videoId, comment, parentCommentId}
        })
    }
    // async getComment(id: string){
    //     return this.fetch<{data:Comment[]}>(`send?videoId=${id}`)
    // };





    async follow(followingId: string){
        return this.fetch("follow", {
            method: "POST",
            body: { followingId }
        })
    };



    // async createPlaylist(playlistName: string):Promise<{ data: Playlist }>{
    //     return this.fetch("playlist", {
    //         method: "POST",
    //         body: { playlistName },
    //     })
    // };
    // async getPlaylist(){
    //     const res = await this.fetch<{data: PlaylistFormData[]}>("playlist");
    //     return res.data;
    // }
    // async deletePlaylist(playlistName: string){
    //     return this.fetch("playlist", {
    //         method: "DELETE",
    //         body: { playlistName },
    //     })
    // };



    async saveVideo(id: string){
        return this.fetch(`save-video?id=${id}`, {
            method: "POST",
        })
    };



    async getSavedVideo(){
        return this.fetch<{data: PlaylistFormData[]}>("save-video");
    }



    async deleteSaved(id:string){
        return this.fetch(`save-video?id=${id}`, {
            method: "DELETE",
        })
    }



    async viewVideo(id: string){
        return this.fetch(`view/${id}`, {
          method: "POST",
        })
    }
    
}

export const apiClient = new ApiClient();