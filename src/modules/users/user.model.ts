import IUser from "@core/interfaces/users.interface";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        index: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
}, {
    timestamps: true
})

export default mongoose.model<IUser & mongoose.Document>('users', UserSchema)