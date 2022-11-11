import jwt from 'jsonwebtoken'
import { User } from '../models/users.js'

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWTTOKEN)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) throw new Error()
        req.user = user
        req.token = token
        next()
    }
    catch (error) {
        res.status(401).send({ 'error': 'Auth error' })
    }
}