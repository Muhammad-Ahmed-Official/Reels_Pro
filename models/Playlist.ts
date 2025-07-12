import mongoose, { model, models, Schema } from "mongoose";

export interface Playlist {
    _id?: string;
    isChecked?: boolean;
    videos: mongoose.Schema.Types.ObjectId[];
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt?: Date;
}

const playlistSchema = new Schema<Playlist>({
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
}, { timestamps: true })

export const Playlist = models?.Playlist || model<Playlist>("Playlist", playlistSchema);