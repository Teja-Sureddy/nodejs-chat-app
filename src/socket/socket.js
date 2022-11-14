import { Server } from 'socket.io';
import { server } from '../app.js';
import { users, addUser, removeUser, combainTwoStringsBySort } from './users.js';
import { Message } from '../models/messages.js'

const io = new Server(server)


io.on('connection', (socket) => {

    socket.on('establishConnection', (user, callBack) => {
        callBack(users)
        addUser(socket.id, user)
        socket.broadcast.emit('userConnected', user)
    })

    socket.on('join', (from, to) => {
        const room = combainTwoStringsBySort(from, to)
        socket.join(room)
    })

    socket.on('sendMessage', async (from, to, message) => {
        const room = combainTwoStringsBySort(from, to)

        const messageModal = new Message({ from, to, message, room })
        const messageObject = await messageModal.save()

        io.to(room).emit('sendMessage', messageObject)
    })

    socket.on('disconnect', () => {
        let user = removeUser(socket.id)
        socket.broadcast.emit('userDisConnected', user)
    })
})