import express from 'express';
import { User } from '../models/users.js'
import { auth } from '../middleware/auth.js'

export const userRouter = new express.Router();


userRouter.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})

userRouter.post('/user/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})

userRouter.get('/user/validate', auth, async (req, res) => {
    res.status(200).send(req.user)
})

userRouter.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
        res.status(200).send(users)
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})

userRouter.delete('/users/session', auth, async (req, res) => {
    try {
        const userObject = await req.user.deleteAuthToken(req.token)
        res.status(200).send(userObject)
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})