import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
// npm i --save-dev @types/bcryptjs
export interface User {
    userName: string;
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is reqired"],
        unique: true,
    },
    
},{ timestamps: true} );


userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    };

    next();
});

export const User = models?.User || model<User>("User", userSchema);