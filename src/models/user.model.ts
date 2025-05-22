import mongoose from "mongoose";
import { encrypt } from "../utils/encrypt";

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

// pre save hook buat encrypt password
UserSchema.pre("save", function (next){
    const user = this; // this = user yang mau disave
    user.password = encrypt(user.password); // user.password diganti jadi password yang udah diencrypt
    next(); // lanjut ke save data
})


// omit user password ketika get data dari database
UserSchema.methods.toJSON = function () {
    const user = this.toObject(); // convert user ke json dan ngehapus properti2 mongoose/ mongodb
    delete user.password; // hapus password dari json
    return user; // return user tanpa password
}


const UserModel = mongoose.model("User", UserSchema);
export default UserModel;