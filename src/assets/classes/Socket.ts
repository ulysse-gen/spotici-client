import store from '@/store';
import { io, Socket as ServerSocket } from 'socket.io-client';

export default class Socket {
    public socket!: ServerSocket;
    private URL: string;
    public connected: boolean;
    constructor(URL: string) {
        this.URL = URL;
        this.connected = false;
    }

    Start() {
        this.socket = io(this.URL, {
            extraHeaders: {
                Authorization: `Bearer ${store.state.auth.access_token}`
            }
        });
        this.connected = this.socket.connected;
        this.subscribeEvents();
        return this;
    }

    Stop() {
        this.socket.disconnect();
        this.connected = this.socket.connected;
    }
 
    subscribeEvents() {
        this.socket.on('connect', this.EventConnect);
        this.socket.on('disconnect', this.EventDisconnect);
        this.socket.on('kicked', this.EventKicked);
    }

    async EventConnect() {
        console.log("Connected to the server.");
    }

    async EventDisconnect() {
        console.log("Disconnected from the server.");
    }

    async EventKicked(reason: string) {
        console.log("You have been disconnected from the server. Reason: " + reason);
    }
}