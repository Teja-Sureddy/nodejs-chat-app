import { Server } from 'socket.io';
import Filter from 'bad-words'
import { server } from './app.js';

const io = new Server(server)
const filter = new Filter();


io.on('connection', (socket) => {
    console.log(socket.id);
})