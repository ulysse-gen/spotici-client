<template>
  <div class="queue">
    <div class="separator"><span>Now playing</span></div>
    
    <TrackView v-bind:track="track" v-if="track"/>
    <div class="separator" v-if="tracks.queue.length != 0"><span>Queued</span><button class="clear-queue-button" @click="clearQueue">Clear queue</button></div>
    <TrackView v-bind:key="'queue'+track.id" v-bind:track="track" v-for="track in tracks.queue" mode="queue"/>
    <div class="separator" v-if="tracks.nextUp.length != 0"><span>Coming next</span><button class="clear-nextup-button" @click="clearNextUp">Clear next up</button></div>
    <TrackView v-bind:key="'nextUp'+track.id" v-bind:track="track" v-for="track in tracks.nextUp" mode="queue"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TrackView from './TrackView.vue';

export default defineComponent({
  name: 'MainQueueView',
  components: { TrackView },
  computed: {
    tracks(): {queue: Array<any>, nextUp: Array<any>} {
      return {
        queue: this.$store.state.app.data.queue,
        nextUp: this.$store.state.app.data.nextUp
      }
    },
    track() {
      return this.$store.state.app.data.nowPlaying.track
    }
  },
  methods: {
    clearQueue() {
      this.$store.commit('clearQueue');
    },
    clearNextUp() {
      this.$store.commit('clearNextUp');
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .queue {
    .separator {
      display: flex;
      align-content: center;
      font-size: 2rem;
      margin: calc(var(--panel-gap)*2) var(--panel-gap) calc(var(--panel-gap)*2) var(--panel-gap);

      button {
        &.clear-queue-button, &.clear-nextup-button {
          outline: none;
          border: none;
          background-color: var(--tertiary-background-color);
          color: var(--light-color-lighter);
          margin-left: auto;
          cursor: pointer;
          border: 2px solid rgba(64, 64, 64, 0.438);
          border-radius: 10px;
        }
      }
    }
  }
</style>