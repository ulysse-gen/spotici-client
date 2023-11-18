<template>
  <div class="grid-item player" :style="dynamicCSS">
    <div class="player-child left-display">
      <font-awesome-icon icon="fa-solid fa-compact-disc" />
    </div>
    <div class="player-child player-controls">
      <div class="controls">
        <div @click="shuffle" class="shuffle" :class="{ active: app.data.shuffle }">
          <font-awesome-icon icon="fa-solid fa-shuffle"/>
        </div>
        <div @click="previous" class="previous">
          <font-awesome-icon icon="fa-solid fa-backward-step"/>
        </div>
        <div @click="playPause" class="play" v-if="app.data.state == 'paused' || app.data.state == 'stopped'" >
          <font-awesome-icon icon="fa-solid fa-play"/>
        </div>
        <div @click="playPause" class="pause" v-if="app.data.state == 'playing'">
          <font-awesome-icon icon="fa-solid fa-pause"/>
        </div>
        <div @click="next" class="next">
          <font-awesome-icon icon="fa-solid fa-forward-step"/>
        </div>
        <div @click="repeat" class="repeat" :class="{ active: app.data.repeat }">
          <font-awesome-icon icon="fa-solid fa-repeat"/>
        </div>
      </div>
      <div class="player-bar"><input @change="seek" @input="Seeking" type="range" v-bind:value="songProgress()" class="progress-bar" min="0" v-bind:max="app.data.nowPlaying.duration"></div>
    </div>
    <div class="player-child right-controls">
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerView',
  mounted() {
    this.app.player.ontimeupdate = () => this.$store.commit('songProgress', this.$store.state.app.player.currentTime);
    this.app.player.onended = () => this.$store.dispatch('songFinished');
  },
  data() {
    return {
      seeking: false,
      currentTimebackup: this.$store.state.app.data.nowPlaying.currentTime
    }
  },
  computed: {
    app() {
      return this.$store.state.app
    },
    dynamicCSS() {
      return `
      --progress-percent: ${((this.$store.state.app.data.nowPlaying.currentTime / this.$store.state.app.data.nowPlaying.duration) * 100) || 0}%;
      `
    },
  },
  methods: {
    songProgress() {
      return (!this.seeking) ? this.$store.state.app.data.nowPlaying.currentTime : this.currentTimebackup;
    },
    Seeking(event: any) {
      this.seeking = true;
      this.currentTimebackup = event.target.value;
    },
    previous() {
      console.log('previous')
    },
    next() {
      this.$store.dispatch('playNextSong');
    },
    playPause() {
      this.$store.commit('playPause');
    },
    shuffle() {
      this.app.data.shuffle = !this.app.data.shuffle;
    },
    repeat() {
      this.app.data.repeat = !this.app.data.repeat;
    },
    seek(event: any) {
      this.$store.state.app.player.currentTime = event.target.value;
      this.seeking = false;
    },
    volume() {
      console.log('volume')
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .player {
    background-color: var(--background-color);
    grid-area: play-bar;
    min-height: 75px;
    max-height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .player-child {
      width: 30%;
    }
  }

  .player-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: center;

    .controls {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      transition-duration: .2s;

      div {
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.play svg {
          transform: translateX(10%);
        }

        &.play, &.pause {
          width: 30px;
          height: 30px;
          background-color: white;
          border-radius: 50%;
          color: black;
          padding: 7px;
          margin: 0 5px 0 5px;
        }

        &.previous, &.next {
          margin: 0 5px 0 5px;
        }

        &.shuffle, &.repeat {
          margin: 0 5px 0 5px;
          width: 15px;
          height: 15px;
        }

        &.active {
          color: var(--accent-color);
        }
      }
    }

    .player-bar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .progress-bar {
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        width: 100%;
        background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) var(--progress-percent), #404040 var(--progress-percent), #404040 100%);
        transition-duration: .2s;
        border-radius: 2.5px;

        &:focus {
          outline: none;

          &::-webkit-slider-thumb {
            outline: 3px solid transparent;
            outline-offset: 0.125rem;
          }
        }

        &::-webkit-slider-runnable-track {
          background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) var(--progress-percent), #404040 var(--progress-percent), #404040 100%);
          border-radius: 2.5px;
          height: 5px;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none; /* Override default look */
          appearance: none;
          margin-top: -4px; /* Centers thumb on the track */
          background-color: transparent;
          border-radius: 50%;
          height: 13px;
          width: 13px;
        }

        &:hover {
          background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--progress-percent), #404040 var(--progress-percent), #404040 100%);
          
          &::-webkit-slider-runnable-track {
            background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--progress-percent), #404040 var(--progress-percent), #404040 100%);
          }

          &::-webkit-slider-thumb {
            background-color: var(--accent-color);
        }
        }
      }
    }
  }
</style>
