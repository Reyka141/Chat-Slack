import { io } from 'socket.io-client';

const SOCKET_URL = window.location.href;

const socket = io(SOCKET_URL);

export default socket;
