import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number; 
    };
    createdAt: Date;
    updatedAt?: Date;
    user: mongoose.Types.ObjectId;
    views: number;
}


const videoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    controls: {
        type: Boolean,
        default: true,
    },
    transformation: {
        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height,
        },
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width, 
        },
        quality: {
            type: Number,
            min: 1,
            max: 100,
        },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })


export const Video = models.Video || model<IVideo>("Video", videoSchema);