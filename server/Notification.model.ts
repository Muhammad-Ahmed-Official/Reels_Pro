import pkg from 'mongoose';
const { model, models, Schema, Types } = pkg;

export interface INotification {
    _id?: typeof Types.ObjectId;
    typeNotification: "like" | "follow" | "comment" | "video";
    sender: string;
    recipient: string;
    reelId?: string;
    isRead?: boolean;
    msg: string;
    // allFollower?: {};
    createdAt: Date;
    updatedAt?: Date;
}


const notificationSchema = new Schema<INotification>({
    typeNotification: {
        type: String,
        enum: ["like", "follow", "comment"],
        required: true,
        
    },
    sender: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    msg: {
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