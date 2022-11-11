import { getSessionToken } from '../session/session.js';

export default async function api(url, method = 'POST', body, token = null) {
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: new Headers({
            'Authorization': 'Bearer ' + getToken(token),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    })
    return await response.json();
}

const getToken = (token) => {
    if (token) return token
    return getSessionToken()
}