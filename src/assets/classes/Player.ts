import store from '@/store';
import { io, Socket as ServerSocket } from 'socket.io-client';
import Socket from './Socket';

export default class Player {
    public socket?: Socket;
    public isPlaying: boolean;
    public id!: string;
    public name!: string;
    public volume!: number;
    public progression!: number;
    public track!: SpotIci.Track;
    public UUID!: string;
    private interval?: number;
    private intervalTime: number;
    constructor(Socket?: Socket) {
        this.isPlaying = false;
        this.name = "Unknown player";
        this.intervalTime = 2500;
        if (Socket)this.socket = Socket;

        if (Socket)this.interval = setInterval(this.update.bind(this), this.intervalTime);
    }

    announce() {
        if (!this.socket)return this;
        this.socket?.socket.emit('announce', {
            UUID: this.UUID, isPlaying: this.isPlaying, name: this.name, volume: this.volume, progression: this.progression, track: this.track
        });
        return this;
    }

    update() {
        if (!this.socket)return this;
        this.socket?.socket.emit('update', {
            UUID: this.UUID, isPlaying: this.isPlaying, name: this.name, volume: this.volume, progression: this.progression, track: this.track
        });
        return this;
    }

    updateSocket(socket: Socket) {
        this.socket = socket;
        this.announce();
        if (socket)this.interval = setInterval(this.update.bind(this), this.intervalTime);
        return this;
    }

    setPlaying(isPlaying = true) {
        this.isPlaying = isPlaying;
        this.update();
        return this;
    }

    setProgression(progression: number){
        this.progression = progression;
        return this;
    }

    nowPlaying(Track: SpotIci.Track) {
        this.track = Track;
        this.update();
        return this;
    }

    setVolume(volume: number){
        this.volume = volume;
        return this;
    }

    setNotPlaying(isPlaying = false) {
        this.isPlaying = isPlaying;
        this.update();
        return this;
    }

    setName(name: string) {
        this.name = name;
        this.update();
        return this;
    }

    setId(id: string) {
        this.id = id;
        this.announce();
        return this;
    }

    setUUID(UUID: string) {
        this.UUID = UUID;
        return this;
    }
}