import mongoose, { model, models, Schema } from "mongoose";

export interface Comment {
    _id: string;
    profilePic: string;
    // isVerified: boolean;
    comment: string;
    user: mongoose.Types.ObjectId;
    videoId: mongoose.Types.ObjectId;
    parentCommentId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const commentSchema = new Schema<Comment>({
    comment: {
        type: String,
        required: [true, "Comment is required"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
    },
    parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    }
}, { timestamps: true})

export const Comment = models?.Comment || model<Comment>("Comment", commentSchema);