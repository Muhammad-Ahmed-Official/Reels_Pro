import { Comment } from "@/models/Comment";
import { Like } from "@/models/Like";
import { Playlist } from "@/models/Playlist";
import { User } from "@/models/User";
import { IVideo } from "@/models/Video";
import { IChat } from "@/server/Models/Chat.model";
import { INotification } from "@/server/Models/Notification.model";

export type VideosFormData = Omit<IVideo, "_id" | "user" | "views">;

export type UserFromData = Pick<User, "userName" | "email" | "password">;

export type NotificaitonData = INotification

export type ChatData = IChat

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
    isLiked?: boolean;
    commentWithUser: Comment[];
    likes?: number;
    isFollow: boolean;
    savedVideo?: boolean;
    allUsersExceptLoggedIn?: [
        {
            _id:string,
            userName: string,
            profilePic: string
        }
    ]
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

const server = "http://localhost:3000/api";

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
    };

    async getUser(){
        const response = await this.fetch<{data: User}>("profile/updateInfo");
        return response.data;
    }


    // async getUsers(){
    //     const response = await this.fetch<{data:User}>("user");
    //     return response.data;
    // };



    async getFollowers(){
        const response = await this.fetch<{data: string[]}>("profile/followInfo");
        return response.data
    }



    async updateProfile(data:string){
        return this.fetch("profile/updateInfo",{
            method: "POST",
            body: data,
        })
    }



    async updatePass(data:string){
        return this.fetch("profile/updatePass", {
            method: "PUT",
            body: data,
        })
    }


    // async getVideo(id: string){
    //     const res = await this.fetch<{data:VideoFormData[]}>(`getVideo?id=${id}`)
    //     return res.data;
    // }


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

    async viewVideo(id:string){
        return this.fetch(`videos?id=${id}`, {
            method: "PUT"
        })
    }


    async createNotification(notifiData: NotificaitonData){
        return this.fetch(`${server}/notify`, {
            method: "POST",
            body: notifiData,
        })
    }



    async likeUnlikeVideo(id: string){
        return this.fetch("like-video", {
            method: "POST",
            body: { videoId: id }
        })
    };


    async shareVideo(data:string){
        return this.fetch("share-video", {
            method: "POST",
            body: data,
        })
    }



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


    async getComment(id: string){
        return this.fetch<{data:Comment[]}>(`send?videoId=${id}`)
    };


    async deleteComment(id:string){
        return this.fetch(`send?commentId=${id}`, {
            method: "DELETE",   
        })
    };


    async updateComment(commentId:string, comment:string){
        return this.fetch("send", {
            method: "PUT",
            body: {commentId, comment},
        })
    };


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



    async deleteSavedVideo(collectionId:string, id:string){
        return this.fetch('save-video', {
            method: "DELETE",
            body: {collectionId, id}
        })
    }


    async deletePlaylist(id:string){
        return this.fetch(`playlistCollection?id=${id}`, {
            method: "DELETE",
        })
    }



    async createMsg(data:IChat){
        return this.fetch(`message`, {
            method: "POST",
            body: data
        })
    }


    async getMsg(id:string){
        const res = await this.fetch<{data: ChatData}>(`message?id=${id}`);
        return res.data;
    }


    async searchUserChat(userName:string){
        const res = await this.fetch<{data: ChatData}>(`search-user?userName=${userName}`);
        return res.data;
    }



    async sidebarUsers(){
        const res = await this.fetch<{data: ChatData}>("sidebar-users");
        return res.data;
    }


    async getNotification(){
        const res = await this.fetch<{data:NotificaitonData}>("notification");
        return res.data;
    };

    
    
    async delNotification(id: string){
        return this.fetch(`notification?id=${id}`, {
            method: "DELETE",
        });
    };
    
}

export const apiClient = new ApiClient();