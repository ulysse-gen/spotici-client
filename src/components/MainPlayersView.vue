<template>
  <div class="players">
    <div class="separator"><span>Players</span></div>
    <PlayerListItemView v-bind:key="player.UUID" v-bind:playerUUID="(player.id) ? player.id : player.UUID" v-for="player in players"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlayerListItemView from './PlayerListItemView.vue';
import Player from '../assets/classes/Player';

export default defineComponent({
  name: 'MainPlayersView',
  components: { PlayerListItemView },
  computed: {
    players(): Array< Player> {
      return Array.from(this.$store.state.app.data.players.values())
    }
  },
  methods: {
    playOnThisPlayer() {
      this.$store.commit('playOnThisPlayer');
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .players {
    .separator {
      display: flex;
      align-content: center;
      font-size: 2rem;
      margin: calc(var(--panel-gap)*2) var(--panel-gap) calc(var(--panel-gap)*2) var(--panel-gap);
    }
  }
</style>