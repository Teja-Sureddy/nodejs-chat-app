import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

messageSchema.methods.toJSON = function () {
    const message = this
    const messageobject = message.toObject()
    return messageobject;
}

export const Message = mongoose.model('Messages', messageSchema)