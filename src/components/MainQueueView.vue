<template>
  <div class="queue">
    Now playing
    <TrackView v-bind:track="track" v-if="track"/>
    Queued
    <TrackView v-bind:key="'queue'+track.id" v-bind:track="track" v-for="track in tracks.queue" mode="queue"/>
    Next Up
    <TrackView v-bind:key="'nextUp'+track.id" v-bind:track="track" v-for="track in tracks.nextUp" mode="queue"/>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>

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
  }
});
</script>