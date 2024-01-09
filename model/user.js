import mongoose from "mongoose"



const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true
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