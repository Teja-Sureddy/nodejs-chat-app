import express from 'express';
import { Message } from '../models/messages.js'
import { auth } from '../middleware/auth.js'

export const messageRouter = new express.Router();

messageRouter.get('/messages', auth, async (req, res) => {
    try {
        const messages = await Message.find()
        res.status(201).send(messages)
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})