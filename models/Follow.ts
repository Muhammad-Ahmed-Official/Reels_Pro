import mongoose, { model, models, Schema } from "mongoose";

export interface Follow{
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
}

const followSchema = new Schema<Follow>({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
})

export const Follow = models?.Follow || model<Follow>("Follow", followSchema);