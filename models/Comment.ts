import mongoose, { model, models, Schema } from "mongoose";

export interface Comment {
    comment: string;
    user: mongoose.Schema.Types.ObjectId;
    video: mongoose.Schema.Types.ObjectId;
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
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
    }
})

export const Comment = models?.Comment || model<Comment>("Comment", commentSchema);