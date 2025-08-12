import pkg from 'mongoose';
const { model, models, Schema } = pkg;

export interface INotification {
    _id?: string;
    typeNotification: "like" | "follow" | "comment" | "video";
    // sender: string;
    receiver: string;
    reelId?: string;
    isRead?: boolean;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}


const notificationSchema = new Schema<INotification>({
    typeNotification: {
        type: String,
        enum: ["like", "follow", "comment", "video"],
        required: true,
        
    },
    receiver: {
        type: String,
        required: true,
    },
    // recipient: {
    //     type: String,
    //     required: true,
    // },
    message: {
        type: String,
        required: true,
    },
    reelId: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false, 
    }
}, { timestamps: true })

export const Notification = models?.Notification || model<INotification>("Notification", notificationSchema);