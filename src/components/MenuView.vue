<template>
  <div class="grid-item menu-and-library">
    <div class="menu">
      <button @click="navigate('/home')"><font-awesome-icon icon="fa-solid fa-house" />Home</button>
      <button @click="navigate('/search')"><font-awesome-icon icon="fa-solid fa-magnifying-glass" />Search</button>
    </div>
    <div class="library">
      Library: Playlists, Albums, Artists
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuView',
  methods: {
    navigate(path: string) {
      this.$store.commit('navigate', path);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .menu-and-library {
    grid-area: left-sidebar;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .menu, .library {
    border-radius: 10px;
    background-color: #121212;
    padding: 10px;
  }

  .menu {
    display: flex;
    flex-direction: column;
    width: 100%;

    button {
      background-color: transparent;
      border: transparent;
      outline: transparent;
      color: #ffffffbb;
      transition-duration: .2s;
      height: 40px;
      text-align: left;
      cursor: pointer;
      font-size: larger;

      svg {
        margin-right: 15px;
      }

      &:hover {
        color: #fff;
      }
    }
  }

  .library {
    width: 100%;
    flex: 1;
  }
</style>
