import express from 'express';
import { Message } from '../models/messages.js'
import { auth } from '../middleware/auth.js'

export const messageRouter = new express.Router();

messageRouter.post('/messages', auth, async (req, res) => {
    try {
        var date = new Date();
        date.setDate(date.getDate() - 1);
        const messages = await Message.find({ room: req.body.room, createdAt: { $gt: date } })
        res.status(200).send(messages)
    }
    catch (error) {
        res.status(400).send({ 'error': error.message })
    }
})