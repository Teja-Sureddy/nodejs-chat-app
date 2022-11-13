const socket = io()
import { getUser } from '../session/session.js';
import { getMessages, messages, setStatus, appendSelectedUserMessage } from '../chat.js';

var currentUser = getUser();
document.getElementById('user-header').innerHTML = 'Welcome ' + currentUser.name;

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

socket.on('sendMessage', async (message) => {
    if (!messages[message.room]) await getMessages(message.room)
    else messages[message.room].push(message)
    appendSelectedUserMessage(message)
})