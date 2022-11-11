import api from './fetch/fetch.js';
import toast from './toast/toast.js';
import { setSession } from './session/session.js';

const loginForm = document.querySelector('#loginForm');
const loginFormButton = document.querySelector('#loginFormButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    loginFormButton.disabled = true;
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value

    const response = await api('/user/login', undefined, { email, password })
    if (response.error) {
        loginFormButton.disabled = false;
        toast(response.error)
        return
    }
    setSession(response.user, response.token)
    location.href = '/chat'
})