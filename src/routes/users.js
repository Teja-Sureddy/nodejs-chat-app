import express from 'express';
import { User } from '../models/users.js'

export const userRouter = new express.Router();


userRouter.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})