import api from './fetch/fetch.js';
import { getUser, deleteSession } from './session/session.js';
import { createRoom, sendMessage } from './socket/socket.js';

const currentUser = getUser();
const usersElement = document.querySelector('#users')
const chatContainer = document.getElementById('chat-container')
const chatSection = document.getElementById('chat-section')
const messageForm = document.getElementById('message-form')
const sendButton = document.getElementById('send-button')
var to;
var usersList;
export var messages = {};

chatContainer.style.display = "none";

document.querySelector('#logout').addEventListener('click', async (event) => {
    await api('/users/session', 'DELETE', undefined)
    deleteSession()
})

export const renderUsers = async () => {
    usersList = await api('/users', 'GET', undefined)
    usersList.forEach(eachUser => {
        eachUser.status = false;
        eachUser.notifications = 0;
        let element = document.createElement("div");
        element.innerHTML = changeUserText(eachUser);
        element.setAttribute('id', eachUser._id);
        element.addEventListener('click', (event) => {
            selectUser(eachUser)
        })
        usersElement.appendChild(element);
        createRoom(eachUser._id)
    })
}

export const getMessages = async (room) => {
    const messagesList = await api('/messages', 'POST', { room })
    messages[room] = messagesList
}

export const setStatus = (users = null, status = false) => {
    if (users.length > 0) {
        users.forEach((eachUser) => {
            let element = document.getElementById(eachUser._id)
            if (element) {
                let user = usersList.find((user) => user._id === eachUser._id)
                user.status = status;
                user.notifications = user.notifications ? user.notifications : 0;
                element.innerHTML = changeUserText(user);
            }
        })
    }
}

const selectUser = async (user) => {
    to = user._id;
    chatSection.innerHTML = '';
    chatContainer.style.display = "block";
    const room = combainTwoStringsBySort(currentUser._id, to)
    if (!messages[room]) await getMessages(room)
    if (messages[room].length > 0) {
        messages[room].forEach(eachMessage => {
            append(eachMessage)
        })
    }
    user.notifications = 0
    let element = document.getElementById(user._id)
    if (element) {
        element.innerHTML = changeUserText(user)
    }
    chatSection.scrollTop = chatSection.scrollHeight
    highlightChatUser(user._id)
}

export const appendSelectedUserMessage = (message) => {
    if (to === message.to || to === message.from) {
        append(message)
    }
    else {
        let user = usersList.find((user) => message.from === user._id)
        if (user) {
            user.notifications = user.notifications ? user.notifications + 1 : 1;
            let element = document.getElementById(message.from)
            if (element) {
                element.innerHTML = changeUserText(user);
            }
        }
    }
}

const changeUserText = (user) => {
    return user.name + (user.status ? '<div class="online"></div>' : '<div class="offline"></div> ') + (user.notifications ? '<div class="notification">' + user.notifications + '</div>' : '')
}

const append = (eachMessage) => {
    let division = document.createElement("div");
    let paragraph = document.createElement("p");
    paragraph.innerHTML = moment(eachMessage.createdAt).format("h:mm a") + ' - ' + eachMessage.message;
    division.appendChild(paragraph)
    eachMessage.from === currentUser._id ? division.classList.add('right') : division.classList.add('left')
    chatSection.appendChild(division);
    scrollToBottom()
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

const scrollToBottom = () => {
    const newMessageHeight = chatSection.offsetHeight + parseInt(getComputedStyle(chatSection.lastElementChild).marginBottom)
    const containerHeight = chatSection.scrollHeight
    if (containerHeight - newMessageHeight <= chatSection.scrollTop + chatSection.offsetHeight) chatSection.scrollTop = chatSection.scrollHeight
}

const highlightChatUser = (id) => {
    var children = usersElement.children
    for (let index = 0; index < children.length; index++) {
        if (children[index].classList.contains('selectedUser')) {
            children[index].classList.remove('selectedUser');
        }
    }
    document.getElementById(id).classList.add('selectedUser');
}

renderUsers()