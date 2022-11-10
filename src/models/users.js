import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) throw new Error('In-valid E-mail.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (!validator.isStrongPassword(val)) throw new Error('Password not to strong.')
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userobject = user.toObject()
    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar
    return userobject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTTOKEN)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('invalid credentails')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('invalid credentails')
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

export const User = mongoose.model('Users', userSchema)