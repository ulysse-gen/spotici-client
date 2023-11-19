import { createStore } from 'vuex'
import cookies from 'js-cookie'

import router from '@/router/index';

export default createStore({
  state: {
    auth: {
      user: null as null | object,
      access_token: cookies.get('access_token') || null
    },
    app: {
      searchResults: {tracks: [], albums: [], artists: [], playlists: []} as SpotIci.LibraryQueryResult,
      player: new Audio(),
      data: {
        nowPlaying: {
          artists: [] as Array<SpotIci.Artist>,
          album: undefined as SpotIci.Album | undefined,
          track: undefined as SpotIci.Track | undefined,
          duration: 0,
          currentTime: 0
        },
        queue: [] as Array<SpotIci.Track>,
        nextUp: [] as Array<SpotIci.Track>,
        state: "stopped" as "stopped" | "playing" | "paused",
        shuffle: false,
        repeat: false
      }
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.auth.user && state.auth.access_token
    }
  },
  mutations: {
    async login(state, access_token: string) {
      const UserRequest = await fetch("http://localhost:3000/v1/users/@me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
          }
      });
      const User: {data: any} = (await UserRequest.json());
      state.auth.user = await User.data;
      state.auth.access_token = access_token;
      cookies.set('access_token', access_token);
      router.push('/');
    },
    async logOut(state) {
      cookies.remove('access_token');
      state.auth.user = null;
      state.auth.access_token = null;
      router.push('/login');
    },
    setSearchResults(state, searchResults: SpotIci.LibraryQueryResult) {
      state.app.searchResults = searchResults;
    },
    addSearchResults(state, searchResults: SpotIci.LibraryQueryResult) {
      state.app.searchResults.tracks = state.app.searchResults.tracks.filter(track => searchResults.tracks.map(track2 => track2.id).includes(track.id)).concat(searchResults.tracks);
      state.app.searchResults.albums = state.app.searchResults.albums.filter(album => searchResults.albums.map(album2 => album2.id).includes(album.id)).concat(searchResults.albums);
      state.app.searchResults.artists = state.app.searchResults.artists.filter(artist => searchResults.artists.map(artist2 => artist2.id).includes(artist.id)).concat(searchResults.artists);
      state.app.searchResults.playlists = state.app.searchResults.playlists.filter(playlist => searchResults.playlists.map(playlist2 => playlist2.id).includes(playlist.id)).concat(searchResults.playlists);
    },
    async nowPlaying(state, Track: SpotIci.Track) {
      state.app.data.nowPlaying.album = Track.album;
      state.app.data.nowPlaying.track = Track;
      state.app.data.nowPlaying.artists = Track.artists;
      state.app.data.nowPlaying.duration = state.app.player.duration;
      state.app.data.state = "playing";
    },
    addToQueue(state, TrackOrTracks: SpotIci.Track | Array<SpotIci.Track>) {
      if (Array.isArray(TrackOrTracks)){
        state.app.data.queue.push(...TrackOrTracks);
      }else {
        state.app.data.queue.push(TrackOrTracks);
      }
    },
    removeFromQueue(state, TrackOrTracks: SpotIci.Track | Array<SpotIci.Track>) {
      if (Array.isArray(TrackOrTracks)){
        state.app.data.queue = state.app.data.queue.filter(track => !TrackOrTracks.map(track2=> track2.id).includes(track.id));
      }else {
        state.app.data.queue = state.app.data.queue.filter(track => track.id != TrackOrTracks.id);
      }
    },
    setNextUp(state, TrackOrTracks: Array<SpotIci.Track>) {
      state.app.data.nextUp = [...TrackOrTracks];
    },
    clearNowPlaying(state) {
      state.app.data.nowPlaying.album = state.app.data.nowPlaying.track = undefined;
      state.app.data.nowPlaying.artists = [];
    },
    playPause(state) {
      if (state.app.data.state == "playing") {
        state.app.data.state = "paused";
        state.app.player.pause();
      }else if (state.app.data.state == "paused" || state.app.data.state == "stopped") {
        if (!state.app.data.nowPlaying.track)return;
        state.app.data.state = "playing";
        state.app.player.play();
      }
    },
    songProgress(state, currentTime) {
      state.app.data.nowPlaying.currentTime = currentTime;
    },
    seek(state, value) {
       state.app.player.currentTime = value;
    },
    volume(state, value) {
      state.app.player.volume = value;
    }
  },
  actions: {
    async LoadTrack(context, Track: SpotIci.Track){
      return (Track.buffer) ? await Track.buffer :  await fetch("http://localhost:3000/v1/tracks/play/" + Track.id, {
        method: "GET",
        headers: {
          "Content-Type": "audio/mpeg",
          "Authorization": "Bearer " + this.state.auth.access_token
        }
      }).then(async res => {
        return res.arrayBuffer()
      });
    },
    async playTrack(context, PlayInfos: {Track: SpotIci.Track, Context?: Array<SpotIci.Track>, addContextToNextUp: false}) {
      const buffer = await this.dispatch('LoadTrack', PlayInfos.Track);
      if (PlayInfos.addContextToNextUp && PlayInfos.Context) {
        const TrackIndex = PlayInfos.Context.findIndex((track: any) => track.id == PlayInfos.Track.id);
        const addSongsTonextUp = PlayInfos.Context.slice(TrackIndex+1);
        this.commit('setNextUp', addSongsTonextUp);
      }
      this.dispatch('loadComingSong', 4);
      this.state.app.player.src = URL.createObjectURL(new Blob([buffer]));
      await this.state.app.player.play();
      this.commit("nowPlaying", PlayInfos.Track)
      const ctx = new AudioContext();
      return ctx.decodeAudioData(buffer);
    },
    async songFinished(context) {
      this.state.app.data.nowPlaying.currentTime = this.state.app.player.duration;
      if (this.state.app.data.repeat) return this.state.app.player.play();
      if (this.state.app.data.queue.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.queue.shift()});
      if (this.state.app.data.nextUp.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.nextUp.shift()});
      this.state.app.data.state = "stopped";
    },
    async loadComingSong(context, amount = 1) {
      if (this.state.app.data.repeat) return;
      if (this.state.app.data.queue.length != 0){
        const Tracks = this.state.app.data.queue.slice(0, (amount <= this.state.app.data.queue.length) ? amount : this.state.app.data.queue.length);
        for (const Track of Tracks) {
          Track.buffer = await this.dispatch('LoadTrack', Track);
        }
        return;
      }
      if (this.state.app.data.nextUp.length != 0){
        const Tracks = this.state.app.data.nextUp.slice(0, (amount <= this.state.app.data.nextUp.length) ? amount : this.state.app.data.nextUp.length);
        for (const Track of Tracks) {
          Track.buffer = await this.dispatch('LoadTrack', Track);
        }
        return;
      }
    },
    async playNextSong() {
      if (this.state.app.data.queue.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.queue.shift()});
      if (this.state.app.data.nextUp.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.nextUp.shift()});
    },
  },
  modules: {
  }
})
