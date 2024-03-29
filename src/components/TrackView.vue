<template>
  <div class="track" @dblclick="playSong" @contextmenu.prevent="trackOptions" :class="{ nowPlaying: (isPlaying && (!mode || mode != 'queue')), queued: inQueue, nextUp: inNextUp }">
    <div class="play-button" @click="playSong">
      <font-awesome-icon icon="fa-solid fa-play" v-if="!mode || mode == 'search'"/>
    </div>
    <img class="artwork" v-bind:src="track?.album.image"/>
    <div class="track-infos">
      <span class="name">{{ track?.name }}</span>
      <span class="artists">
        <template v-bind:key="artist.id" v-for="(artist, index) in track?.artists">
          <template v-if="index > 0">, </template>
          <span class="artist-name" @click="$router.push(`/artist/${artist.id}`)">{{ artist.name }}</span>
        </template>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
  name: 'TrackView',
  components: {},
  computed: {
    player(): HTMLAudioElement {
      return this.$store.state.app.player;
    },
    isPlaying() {
      return this.$store.state.app.data.nowPlaying.track && (this.$store.state.app.data.nowPlaying.track.id == this.track?.id);
    },
    inQueue() {
      return this.$store.state.app.data.queue.map((track: any) => track.id).includes(this.track?.id)
    },
    inNextUp() {
      return this.$store.state.app.data.nextUp.map((track: any) => track.id).includes(this.track?.id)
    }
  },
  props: {
    track: Object,// as PropType<SpotIci.Track>,
    mode: String
  },
  methods: {
    async playSong() {
      await this.$store.dispatch('playTrack', {Track: this.track, Context: this.$store.state.app.searchResults.tracks, addContextToNextUp: true});
    },
    async trackOptions(event: any) {
      if (!this.inQueue) {
        this.$store.commit('addToQueue', this.track);
      }else if (this.inQueue) {
        this.$store.commit('removeFromQueue', this.track);
      }
    },
    gotoArtist(artistId: string) {
      this.$store.commit('navigate', '/artist/:'+artistId);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .track {
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

    .play-button {
      margin-left: 10px;
      margin-right: 10px;
      cursor: pointer;
    }

    .artwork {
      height: 90%;
      border-radius: 5px;
    }

    .track-infos {
      display: flex;
      flex-direction: column;
      margin-left: var(--panel-gap);
      font-family: 'Noto Sans Glagolitic', sans-serif;

      .artists {
          .artist-name{
            color: var(--light-color-main);
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: var(--light-color-lighter);
            }
          }
        }

    }

    &.nextUp {
      .play-button, .track-infos .name {
        color: #9dffa5;
      }
    }

    &.queued {
      .play-button, .track-infos .name {
        color: #9dd0ff;
      }
    }

    &.nowPlaying {
      .play-button, .track-infos .name {
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
