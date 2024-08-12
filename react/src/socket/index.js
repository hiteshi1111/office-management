import { io } from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_SOCKET_URL;

const socket = io(ENDPOINT, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
});

export default socket;