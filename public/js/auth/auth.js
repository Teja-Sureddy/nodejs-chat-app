import { getSession, deleteSession } from '../session/session.js';

var auth = document.getElementById("auth").getAttribute("auth");
var session = await getSession();

if (auth && !session) deleteSession()
else if (!auth && session) location.href = '/chat'