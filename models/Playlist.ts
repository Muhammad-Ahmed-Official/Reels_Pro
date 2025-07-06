import mongoose, { model, models, Schema } from "mongoose";

export interface Playlist {
    _id?: string;
    playlistName: string;
    isChecked?: boolean;
    videos: mongoose.Schema.Types.ObjectId[];
    user: mongoose.Schema.Types.ObjectId;
}

const playlistSchema = new Schema<Playlist>({
    playlistName: {
        type: String,
        unique: true,
    },
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
})

export const Playlist = models?.Playlist || model<Playlist>("Playlist", playlistSchema);