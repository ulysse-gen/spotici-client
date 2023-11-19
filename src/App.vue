<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted() {
    if (this.$cookies.get('access_token'))this.$store.commit('login', this.$cookies.get('access_token'))
  }
});
</script>

<style lang="scss">
:root {
  --background-color: black;
  --item-background-color: #121212;
  --accent-color: rgb(255, 0, 64);
  --panel-gap: 8px;
}

*  {
  box-sizing: border-box;
}

html {
  background-color: var(--item-background-color);
  height: 100%;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  padding: 0;
  border: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#app {

  .grid {
    position: absolute;
    grid-template-areas: "left-sidebar main-view right-sidebar" "play-bar play-bar play-bar";
    padding: var(--panel-gap) 0px 0px var(--panel-gap);
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
    gap: var(--panel-gap);
    display: grid;
    height: 100%;
    width: 100%;
  }
  
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
}
</style>