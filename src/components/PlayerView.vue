<template>
  <div class="grid-item player" :style="dynamicCSS()">
    <div class="player-child left-display">
      <div class="artwork">
        <font-awesome-icon icon="fa-solid fa-compact-disc" />
      </div>
      <div class="track-infos" v-if="nowPlaying.track">
        <span class="name">{{ nowPlaying.track.name }}</span>
        <span class="artists">
          <template v-bind:key="artist.id" v-for="(artist, index) in nowPlaying.track?.artists">
            <template  v-if="index > 0">, </template>
            <span class="artist-name" @click="$router.push(`/artist/${artist.id}`)">{{ artist.name }}</span>
          </template>
        </span>
      </div>
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
      <div class="players">
        <font-awesome-icon icon="fa-solid fa-headphones" @click="$router.push('/players')" />
      </div>
      <div class="queue">
        <font-awesome-icon icon="fa-solid fa-bars" @click="$router.push('/queue')" />
      </div>
      <div class="volume">
        <div class="volume-icon">
          <font-awesome-icon v-bind:icon="'fa-solid ' + volumeIcon()"/>
        </div>
        <input @input="volume" type="range" v-bind:value="currentVolume()" class="volume-bar" min="0" max="1" step="0.01"></div>
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
    this.app.player.volume = 0.69;
  },
  data() {
    return {
      seeking: false,
      currentTimebackup: this.$store.state.app.data.nowPlaying.currentTime
    }
  },
  computed: {
    nowPlaying() {
      return this.$store.state.app.data.nowPlaying
    },
    app() {
      return this.$store.state.app
    },
  },
  methods: {
    dynamicCSS() {
      return `
      --progress-percent: ${((this.songProgress() / this.$store.state.app.data.nowPlaying.duration) * 100) || 0}%;
      --volume-percent: ${this.$store.state.app.player.volume*100}%;
      --display-cd-rotation: ${((this.songProgress() / this.$store.state.app.data.nowPlaying.duration) * 2500) || 0}deg;
      --artwork: 
      `
    },
    volumeIcon() {
      if (this.$store.state.app.player.volume > 0.8) return "fa-volume-high";
      if (this.$store.state.app.player.volume > 0.4) return "fa-volume-low";
      if (this.$store.state.app.player.volume > 0) return "fa-volume-off";
      return "fa-volume-xmark";
    },
    currentVolume() {
      return this.$store.state.app.player.volume;
    },
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
      this.$store.commit('seek', event.target.value);
      this.seeking = false;
    },
    volume(event: any) {
      this.$store.commit('volume', event.target.value);
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
    margin-bottom: var(--panel-gap);

    .player-child {
      width: 30%;
    }
  }

  .left-display {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: flex-start;

    .artwork {
      width: 75px;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        transform: rotateZ(var(--display-cd-rotation));
        height: 80%;
        widows: 80%;
      }
    }

    .track-infos {
      margin-left: var(--panel-gap);
      display: flex;
      flex-direction: column;
      font-family: 'Noto Sans Glagolitic', sans-serif;
      
      .name {
        color: var(--light-color-lighter);
      }

      .artists {
      display: flex;
      flex-direction: row;
      font-size: .8rem;
        .artist-name{
            color: var(--light-color-darker);
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: var(--light-color-lighter);
            }
          }
      }
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
          background-color: var(--light-color-lighter);
          border-radius: 50%;
          color: var(--primary-background-deep);
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
        background: linear-gradient(90deg, var(--light-color-lighter) 0%, var(--light-color-lighter) var(--progress-percent), var(--light-color-darker) var(--progress-percent), var(--light-color-darker) 100%);
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
          background: linear-gradient(90deg, var(--light-color-lighter) 0%, var(--light-color-lighter) var(--progress-percent), var(--light-color-darker) var(--progress-percent), var(--light-color-darker) 100%);
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
          background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--progress-percent), var(--light-color-darker) var(--progress-percent), var(--light-color-darker) 100%);
          
          &::-webkit-slider-runnable-track {
            background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--progress-percent), var(--light-color-darker) var(--progress-percent), var(--light-color-darker) 100%);
          }

          &::-webkit-slider-thumb {
            background-color: var(--accent-color);
        }
        }
      }
    }
  }

  .right-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: flex-end;

    .queue, .players {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--light-color-darker);
        transition-duration: .2s;

        &:hover {
          color: var(--light-color-lighter);
        }
    }

    .volume {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 25px;
      margin-left: 5px;

      .volume-icon {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--light-color-darker);
        transition-duration: .2s;

        &:hover {
          color: var(--light-color-lighter);
        }
      }

      .volume-bar {
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
          width: 100px;
          background: linear-gradient(90deg, var(--light-color-lighter) 0%, var(--light-color-lighter) var(--volume-percent), var(--light-color-darker) var(--volume-percent), var(--light-color-darker) 100%);
          transition-duration: .2s;
          border-radius: 2.5px;
          margin-left: 5px;

          &:focus {
            outline: none;

            &::-webkit-slider-thumb {
              outline: 3px solid transparent;
              outline-offset: 0.125rem;
            }
          }

          &::-webkit-slider-runnable-track {
            background: linear-gradient(90deg, var(--light-color-lighter) 0%, var(--light-color-lighter) var(--volume-percent), var(--light-color-darker) var(--volume-percent), var(--light-color-darker) 100%);
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
            background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--volume-percent), var(--light-color-darker) var(--volume-percent), var(--light-color-darker) 100%);
            
            &::-webkit-slider-runnable-track {
              background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-color) var(--volume-percent), var(--light-color-darker) var(--volume-percent), var(--light-color-darker) 100%);
            }

            &::-webkit-slider-thumb {
              background-color: var(--accent-color);
          }
          }
      }
    }
  }
</style>
