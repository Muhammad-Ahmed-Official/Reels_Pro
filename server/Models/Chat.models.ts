// import mongoose, { model, models, Schema} from "mongoose";
import pkg from 'mongoose';
const { model, models, Schema } = pkg;

export interface IChat {
    sender: string;
    receiver: string;
    message: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    seen?: boolean;
}


const chatSchema = new Schema<IChat>({
    sender: { 
        type: String, 
        required: true, 
        index: true 
    },  
    receiver: { 
        type: String, 
        required: true, 
        index: true 
    },
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true})

export const Chat = models.Chat || model<IChat>("Chat", chatSchema);