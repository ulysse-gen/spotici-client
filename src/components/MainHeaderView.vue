<template>
  <div class="header">
    <div class="profile">
      <button @click="profileMenu = !profileMenu;" class="login-button"><img v-bind:src="`/assets/img/pfp/${profilePicture}.jpg`"></button>
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
      return this.$store.state.auth.user.profilePicture;
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
      .login-button {
        background-color: #00000054;
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
        background-color: #000000c9;
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
        background-color: var(--item-background-color);
        padding: 5px;
        width: fit-content;
        border-radius: 10px;

        button {
          background-color: var(--item-background-color);
          border: transparent;
          outline: transparent;
          border-radius: 5px;
          color: white;
          white-space:nowrap;
          min-width: 100%;
          padding: 5px;

          &:hover {
            background-color: #333333;
          }
        }
      }
    }
 }
</style>
