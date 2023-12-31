import mongoose from "mongoose"



const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
},
)

export default mongoose.model('User', UserSchema)