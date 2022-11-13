import api from './fetch/fetch.js';
import { getUser, deleteSession } from './session/session.js';
import { createRoom, sendMessage } from './socket/socket.js';

const currentUser = getUser();
const usersElement = document.querySelector('#users')
const chatContainer = document.getElementById('chat-container')
const chatHeader = document.getElementById('chat-header')
const chatSection = document.getElementById('chat-section')
const messageForm = document.getElementById('message-form')
const sendButton = document.getElementById('send-button')
var to;
export var messages;

chatContainer.style.display = "none";

document.querySelector('#logout').addEventListener('click', async (event) => {
    await api('/users/session', 'DELETE', undefined)
    deleteSession()
})

const renderUsers = async () => {
    const users = await api('/users', 'GET', undefined)
    users.forEach(eachUser => {
        let element = document.createElement("div");
        element.innerHTML = eachUser.name + ' OFFLINE';
        element.setAttribute('id', eachUser._id);
        element.addEventListener('click', (event) => {
            selectUser(eachUser)
        })
        usersElement.appendChild(element);
        createRoom(eachUser._id)
    })
}

const getMessages = async () => {
    messages = await api('/messages', 'GET', undefined)
    messages = messages.reduce((obj, item) => Object.assign(obj, { [item.room]: messages.filter((eachMessage) => eachMessage.room === item.room) }), {});
}

export const setStatus = (users = null, status = 0) => {
    users.forEach((eachUser) => {
        let element = document.getElementById(eachUser._id)
        if (element) {
            return element.innerHTML = eachUser.name + (status ? ' ONLINE' : ' OFFLINE');
        }
    })
}

const selectUser = (user) => {
    chatContainer.style.display = "block";
    chatSection.innerHTML = '';
    to = user._id;
    chatHeader.innerHTML = "Chat - " + user.name;
    const room = combainTwoStringsBySort(currentUser._id, to)
    if (messages[room] && messages[room].length > 0) {
        messages[room].forEach(eachMessage => {
            append(eachMessage)
        })
    }
}

export const appendSelectedUserMessage = (message) => {
    if (to === message.to || to === message.from) {
        append(message)
    }
}

const append = (eachMessage) => {
    let division = document.createElement("div");
    let paragraph = document.createElement("p");
    paragraph.innerHTML = moment(eachMessage.createdAt).format("h:mm a") + ' - ' + eachMessage.message;
    division.appendChild(paragraph)
    eachMessage.from === currentUser._id ? division.classList.add('right') : division.classList.add('left')
    chatSection.appendChild(division);
}

messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    sendButton.disabled = true;
    const message = event.target.elements.message.value
    await sendMessage(to, message)
    event.target.elements.message.value = ''
    event.target.elements.message.focus()
    sendButton.disabled = false;
})

const combainTwoStringsBySort = (from, to) => {
    const compare = from.localeCompare(to);
    return (compare === -1) ? from + to : to + from
}

getMessages()
renderUsers()