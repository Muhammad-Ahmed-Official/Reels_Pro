import mongoose from 'mongoose';
import pkg from 'mongoose';
const { model, models, Schema } = pkg;

export interface IChat {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    message: string;
    image?: string;
    video?:string;
    createdAt?: Date;
    updatedAt?: Date;
    seen?: boolean;
    unreadCount?: number;
    userId?: string;
    // customId?: string;
}


const chatSchema = new Schema<IChat>({
    // customId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true, 
        index: true 
    },  
    receiver: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        index: true 
    },
    message: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true})

export const Chat = models.Chat || model<IChat>("Chat", chatSchema);