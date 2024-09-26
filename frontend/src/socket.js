import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chat-slack-js00.onrender.com/';

const socket = io(SOCKET_URL);

export default socket;