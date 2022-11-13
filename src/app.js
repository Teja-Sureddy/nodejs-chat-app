import express from 'express'
import http from 'http'
import { userRouter } from './routes/users.js'
import { messageRouter } from './routes/messages.js'
import { clientRouter } from './routes/client/client.js'
import './db/db.js'

export const app = express();
app.use(express.json())
app.use(clientRouter)
app.use(userRouter)
app.use(messageRouter)
export const server = http.createServer(app)