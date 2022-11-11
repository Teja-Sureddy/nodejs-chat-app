import api from './fetch/fetch.js';
import { deleteSession } from './session/session.js';
const socket = io()

const usersElement = document.querySelector('#users')

document.querySelector('#logout').addEventListener('click', async (event) => {
    await api('/users/session', 'DELETE', undefined)
    deleteSession()
})

const getUsers = async () => {
    const users = await api('/users', 'GET', undefined)
    users.forEach(user => {
        let element = document.createElement("div");
        element.innerHTML = user.name;
        element.addEventListener('click', (event) => {
            messageUser(user._id)
        })
        usersElement.appendChild(element);
    });
}

const messageUser = (id) => {
    console.log(id);
}

getUsers()