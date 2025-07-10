// npm i --save-dev @types/bcryptjs

import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
export interface User {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    // followers: [mongoose.Types.ObjectId];
    // following: [mongoose.Types.ObjectId];
    profilePic: string;
    TFA: boolean;
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
    verifyCode: {
        type: String,
        required: [true, "Verify code is reqired"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is reqired"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    TFA: {
        type: Boolean,
        default: false,
    },
    profilePic: {
        type: String,
    }
    // followers: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "User",
    //     }
    // ], 
    // following: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "User",
    //     }
    // ],
    
},{ timestamps: true} );


userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    };

    next();
});

export const User = models?.User || model<User>("User", userSchema);