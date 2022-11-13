const socket = io()
import { getUser } from '../session/session.js';
import { messages, setStatus, appendSelectedUserMessage } from '../chat.js';

var currentUser = getUser();
document.getElementById('user-header').innerHTML = 'User - ' + currentUser.name;

socket.emit('establishConnection', currentUser, (users) => {
    setStatus(users, true)
})

socket.on('userConnected', (user) => {
    setStatus(Array(user), true)
    createRoom(user._id)
})

socket.on('userDisConnected', (user) => {
    setStatus(Array(user), false)
})

export const createRoom = (user_id) => {
    socket.emit('join', currentUser._id, user_id)
}

export const sendMessage = async (user_id, message) => {
    socket.emit('sendMessage', currentUser._id, user_id, message)
}

socket.on('sendMessage', (message) => {
    if (messages[message.room] && messages[message.room].length > 0) messages[message.room].push(message)
    else messages[message.room] = Array(message)
    appendSelectedUserMessage(message)
})