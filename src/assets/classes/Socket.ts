import store from '@/store';
import { io, Socket as ServerSocket } from 'socket.io-client';
import Player from './Player';

export default class Socket {
    public socket!: ServerSocket;
    private URL: string;
    public connected: boolean;
    public id!: string;
    public player!: Player;
    constructor(URL: string) {
        this.URL = URL;
        this.connected = false;
    }

    setPlayer(Player: Player) {
        this.player = Player;
        return Player;
    }

    Start() {
        this.socket = io(this.URL, {
            extraHeaders: {
                Authorization: `Bearer ${store.state.auth.access_token}`
            }
        });
        this.id = this.socket.id;
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
        this.socket.on('authed', this.EventAuthed);
        this.socket.on('newplayer', this.EventNewPlayer);
        this.socket.on('deleteplayer', this.EventDeletePlayer);
        this.socket.on('syncplayers', this.EventSyncPlayers);
    }

    async EventConnect() {
        console.log("Connected to the server.");
    }

    async EventDisconnect() {
        store.state.app.data.players = new Map().set('this', store.state.app.data.players.get('this'));
        console.log("Disconnected from the server.");
    }

    async EventKicked(reason: string) {
        console.log("You have been disconnected from the server. Reason: " + reason);
    }

    async EventAuthed(UUID: string) {
        console.log("Authed on the server, UUID:", UUID);
        store.dispatch('SocketAuthed', UUID);
    }

    async EventNewPlayer(data: any) {
        store.commit('NewPlayer', new Player().setName(data.name).setUUID(data.UUID));
        console.log('Creating new player', data.UUID)
    }

    async EventDeletePlayer(playerUUID: string) {
        store.commit('DeletePlayer', playerUUID);
        console.log('Deleting player', playerUUID)
    }

    async EventSyncPlayers(data: any) {
        store.commit('SyncPlayers', data);
        console.log('Syncing player', data.UUID)
    }
}