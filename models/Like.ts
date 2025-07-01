import mongoose, { model, models, Schema } from "mongoose";

export interface Like{
    like: number;
    user: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<Like>({
    like: {
        type: Number,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
    }
})

export const Like = models?.Like || model<Like>("Like", likeSchema);