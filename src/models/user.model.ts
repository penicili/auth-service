import mongoose from "mongoose";

// type casting buat model user
export interface User {
    fullName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    profilePicture: string;
    createdAt?: Date;
}

// buat schema user
const Schema = mongoose.Schema;
const UserSchema = new Schema<User>(
    {
        fullName: {
            type: Schema.Types.String,
            required: true,
        },
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        username: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
        },
        role: {
            type: Schema.Types.String,
            required: true,
            enum: ["admin", "pengemudi", "user"],
            default: "user",
        },profilePicture: {
            type: Schema.Types.String,
            default: "https://imgur.com/mCHMpLT.png",
        },
    },{
        timestamps: true
    }
)



const UserModel = mongoose.model("User", UserSchema);
export default UserModel;