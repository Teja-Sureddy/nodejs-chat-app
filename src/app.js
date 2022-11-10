import express from 'express'
import http from 'http'
import { userRouter } from './routes/users.js'
import './db/db.js'

export const app = express();
app.use(express.json())
app.use(userRouter)
export const server = http.createServer(app)