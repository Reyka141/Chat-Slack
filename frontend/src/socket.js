import { io } from 'socket.io-client';

const SOCKET_URL = 'https://chat-slack-js00.onrender.com/';  // Замените на URL вашего сервера

const socket = io(SOCKET_URL);

export default socket;