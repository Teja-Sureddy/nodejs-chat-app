import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO, { useNewUrlParser: true });