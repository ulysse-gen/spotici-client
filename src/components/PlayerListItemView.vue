<template>
  <div class="player" @dblclick="playOnThis()" @contextmenu.prevent="playOnThis(true)" :class="{ nowPlaying: isPlaying, thisPlayer: thisPlayer }">
    <div class="device-infos">
      <span class="name">Player {{ player?.id }} | {{ (player.isPlaying && player.track) ? `${player.track.name} - ${player.track.artists.map(artist => artist.name).join(', ')}` : `Stopped or paused` }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Player from '../assets/classes/Player';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  name: 'TrackView',
  components: {},
  computed: {
    player(): Player {
      return (this.$store.state.app.data.players as Map<string, Player>).get(this.playerUUID as string) as Player;
    },
    HTMLplayer(): HTMLAudioElement {
      return this.$store.state.app.player;
    },
    isPlaying() {
      return (this.player) ? this.player.isPlaying : false
    },
    thisPlayer() {
      return (this.$store.state.app.data.players as Map<string, Player>).get(this.player?.id)?.socket;
    }
  },
  props: {
    playerUUID: String,// as PropType<SpotIci.Track>,
    mode: String
  },
  methods: {
    async playOnThis(onlyThis = false) {
      console.log('playOnThis', onlyThis)
    },
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .player {
    background-color: var(--tertiary-background-light);
    border: none;
    outline: none;
    color: var(--light-color-lighter);
    height: 55px;
    margin: calc(var(--panel-gap)/2) var(--panel-gap) calc(var(--panel-gap)/2) var(--panel-gap);
    padding: 5px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition-duration: .2s;

    .device-infos {
      display: flex;
      flex-direction: column;
      margin-left: var(--panel-gap);
      font-family: 'Noto Sans Glagolitic', sans-serif;
    }

    &.thisPlayer {
      .play-button, .device-infos .name {
        color: var(--accent-color-deep);
      }
    }

    &.nowPlaying {
      .play-button, .device-infos .name {
        color: var(--accent-color);
      }
    }

    &:hover {
    background-color: var(--tertiary-background-main);
      .play-button {
        color: var(--accent-color);
      }
    }
    
    &:active {
    background-color: var(--tertiary-background-deep);
    }
  }
</style>
