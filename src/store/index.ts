import { createStore } from 'vuex'
import cookies from 'js-cookie'

export default createStore({
  state: {
    auth: {
      user: null as null | object,
      access_token: cookies.get('access_token') || null
    },
    app: {
      view: "/home",
      searchResults: {tracks: [], albums: [], artists: [], playlists: []} as SpotIci.LibraryQueryResult,
      player: new Audio(),
      data: {
        nowPlaying: {
          artists: [] as Array<string>,
          album: null as null | string,
          track: null as null | string,
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
    },
    async logOut(state) {
      cookies.remove('access_token');
      state.auth.user = null;
      state.auth.access_token = null;
    },
    navigate(state, path) {
      state.app.view = path;
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
      state.app.data.nowPlaying.album = Track.album.id;
      state.app.data.nowPlaying.track = Track.id;
      state.app.data.nowPlaying.artists = Track.artists.map(artist => artist.id);
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
      state.app.data.nowPlaying.album = state.app.data.nowPlaying.track = null;
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
  },
  actions: {
    async playTrack(context, PlayInfos: {Track: SpotIci.Track, Context?: Array<SpotIci.Track>, addContextToNextUp: false}) {
      await fetch("http://localhost:3000/v1/tracks/play/" + PlayInfos.Track.id, {
        method: "GET",
        headers: {
          "Content-Type": "audio/mpeg",
          "Authorization": "Bearer " + this.state.auth.access_token
        }
      }).then(async res => res.arrayBuffer()).then(async buffer => {
        if (PlayInfos.addContextToNextUp && PlayInfos.Context) {
          const TrackIndex = PlayInfos.Context.findIndex((track: any) => track.id == PlayInfos.Track.id);
          const addSongsTonextUp = PlayInfos.Context.slice(TrackIndex+1);
          this.commit('setNextUp', addSongsTonextUp);
        }
        this.state.app.player.src = URL.createObjectURL(new Blob([buffer]));
        await this.state.app.player.play();
        this.commit("nowPlaying", PlayInfos.Track)
        const ctx = new AudioContext();
        return ctx.decodeAudioData(buffer);
      });
    },
    async songFinished(context) {
      this.state.app.data.nowPlaying.currentTime = this.state.app.player.duration;
      if (this.state.app.data.repeat) return this.state.app.player.play();
      if (this.state.app.data.queue.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.queue.shift()});
      if (this.state.app.data.nextUp.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.nextUp.shift()});
      this.state.app.data.state = "stopped";
    },
    async playNextSong() {
      if (this.state.app.data.queue.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.queue.shift()});
      if (this.state.app.data.nextUp.length != 0) return this.dispatch('playTrack', {Track: this.state.app.data.nextUp.shift()});
    }
  },
  modules: {
  }
})
