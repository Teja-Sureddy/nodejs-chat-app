import api from './fetch/fetch.js';
import { setSession } from './session/session.js';
import toast from './toast/toast.js';

const signupForm = document.querySelector('#signupForm');
const signupFormButton = document.querySelector('#signupFormButton');

signupForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    signupFormButton.disabled = true;
    const name = event.target.elements.name.value
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value

    const response = await api('/user/signup', undefined, { name, email, password })
    if (response.error) {
        signupFormButton.disabled = false;
        toast(response.error)
        return
    }
    setSession(response.user, response.token)
    location.href = '/chat'
})