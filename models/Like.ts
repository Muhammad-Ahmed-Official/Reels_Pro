import mongoose, { model, models, Schema } from "mongoose";

export interface Like{
    likes: number;
    users: mongoose.Types.ObjectId[];
    video: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<Like>({
    likes: {
        type: Number,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        }
    ],
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
        unique: true,
    }
})

export const Like = models?.Like || model<Like>("Like", likeSchema);