import mongoose from "mongoose"



const CafeSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    address: {
        city: {
            type: String,
        },
        street: {
            type: String,
        },
        build: {
            type: String,
        }
    },
    logo: {
        type: String,
        default: ''
    },
    back: {
        type: String,
        default: ''
    },

    url: {
        type: String,
    },
    _chatId: {
        type: String,
    },
}, {
    timestamps: true
})


export default mongoose.model('Cafe', CafeSchema)