<template>
  <div class="grid" v-if="isLoggedIn">
    <MenuView />
    <PlayerView/>
    <MainView v-bind:options="options"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainView from '@/components/MainView.vue';
import MenuView from '@/components/MenuView.vue';
import PlayerView from '@/components/PlayerView.vue';

export default defineComponent({
  name: 'App',
  mounted() {
    if (this.$cookies.get('access_token'))this.$store.commit('login', this.$cookies.get('access_token'))
    if (!this.isLoggedIn)this.$router.push('/login');
  },
  props: {
    options: Object
  },
  computed: {
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    }
  },
  components: {
    MenuView, PlayerView, MainView
  }
});
</script>