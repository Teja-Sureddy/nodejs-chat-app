import api from '../fetch/fetch.js';

export function setSession(user, token) {
    if (user && token) {
        var date = new Date();
        date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = "user=" + JSON.stringify(user) + expires + "; path=/";
        document.cookie = "token=" + (token || "") + expires + "; path=/";
    }
    else {
        deleteSession()
    }
}

export async function getSession() {
    var session = { user: null, token: null }
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf('user=') == 0) session.user = isJsonString(c.substring(5, c.length));
        else if (c.indexOf('token=') == 0) session.token = c.substring(6, c.length);
    }

    if (session.user && session.token) {
        const response = await api('/user/validate', 'GET', undefined, session.token)
        if (response.error) return null
        setSession(response, session.token);
        return session
    } return null
}


export function deleteSession() {
    document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    location.href = '/'
}


export function getSessionToken() {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf('token=') == 0) return c.substring(6, c.length);
    } return null
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return null;
    }
    return JSON.parse(str);
}