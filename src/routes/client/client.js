import express from 'express';
import { User } from '../../models/users.js'
import { auth } from '../../middleware/auth.js'

export const clientRouter = new express.Router();


clientRouter.get('', ((req, res) => {
    res.render('index', { title: 'Login' })
}))

clientRouter.get('/signup', ((req, res) => {
    res.render('signup', { title: 'Signup' })
}))

clientRouter.get('/chat', ((req, res) => {
    res.render('chat/chat', { title: 'Welcome' })
}))