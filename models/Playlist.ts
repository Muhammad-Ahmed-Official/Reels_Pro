import mongoose, { model, models, Schema } from "mongoose";

export interface Playlist {
    playlist: string;
    video: mongoose.Schema.Types.ObjectId;
}

const playlistSchema = new Schema<Playlist>({
    playlist: {
        type: String,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        index: true,
    }
})

export const Playlist = models?.Playlist || model<Playlist>("Playlist", playlistSchema);