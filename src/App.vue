<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted() {
    if (this.$cookies.get('access_token'))this.$store.dispatch('login', this.$cookies.get('access_token'))
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Glagolitic&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

:root {
  --primary-background-light: #242424;
  --primary-background-main: #141414;
  --primary-background-deep: black;

  --secondary-background-light: #252525;
  --secondary-background-main: #121212;
  --secondary-background-deep: #000000;

  --tertiary-background-light: #0000001a;
  --tertiary-background-main: #00000054;
  --tertiary-background-deep: #000000c9;

  --light-color-lighter: #fff;
  --light-color-main: #c4c4c4;
  --light-color-darker: #707070;

  --accent-color-light: rgb(255, 36, 91);
  --accent-color: rgb(255, 0, 64);
  --accent-color-deep: rgb(204, 0, 51);

  /*--primary-background-light: blue;
  --primary-background-main: blue;
  --primary-background-deep: blue;

  --secondary-background-light: blue;
  --secondary-background-main: blue;
  --secondary-background-deep: blue;

  --tertiary-background-light: blue;
  --tertiary-background-main: blue;
  --tertiary-background-deep: blue;

  --light-color-lighter: blue;
  --light-color-main: blue;
  --light-color-darker: blue;

  --accent-color-light: blue;
  --accent-color: blue;
  --accent-color-deep: blue;*/

  
  --panel-gap: 8px;
}

*  {
  box-sizing: border-box;
}

html {
  background-color: var(--primary-background-deep);
  height: 100%;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--light-color-lighter);
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
  background-color: var(--primary-background-deep);
}
</style>