<template>
  <div class="header">
    <div class="profile">
      <button @click="profileMenu = !profileMenu;" class="profile-button"><img v-bind:src="`http://localhost:3000/v1/images/${profilePicture}`"></button>
      <div class="profile-menu" v-if="profileMenu">
        <button @click="logOut">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainHeaderView',
  data() {
    return {
      profileMenu: false
    }
  },
  methods: {
    logOut() {
      this.$store.commit("logOut");
    }
  },
  computed: {
    profilePicture() {
      return 0
      /*console.log(this.$store.state.auth.user)
      return this.$store.state.auth.user.images[0].url;*/
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .header {
    margin: 10px;
    display: flex;
      height: 64px;

    .profile {
      margin-left: auto;
      height: 32px;
      width: 32px;
      .profile-button {
        background-color: var(--tertiary-background-main);
        border: transparent;
        outline: transparent;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition-duration: .2s;
        height: 100%;
        width: 100%;
        cursor: pointer;

        &:hover {
        background-color: var(--tertiary-background-deep);
        transform: scale(1.1);
        }

        &:active {
          opacity: .5;
          transform: scale(1.03);
        }

        img {
          height: 80%;
          border-radius: 50%;
        }
      }

      .profile-menu {
        position: relative;
        right: 150%;
        top: 10px;
        background-color: var(--secondary-background-main);
        padding: 5px;
        width: fit-content;
        border-radius: 10px;
        font-family: 'Rubik', sans-serif;

        button {
          background-color: var(--secondary-background-main);
          border: transparent;
          outline: transparent;
          border-radius: 5px;
          color: var(--light-color-lighter);
          white-space:nowrap;
          min-width: 100%;
          padding: 5px;

          &:hover {
            background-color: var(--light-color-darker);
          }
        }
      }
    }
 }
</style>
