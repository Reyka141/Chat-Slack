import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000/';  // Замените на URL вашего сервера

const socket = io(SOCKET_URL);

export default socket;