<template>
  <div class="login" v-if="loginMode">
    <div class="login-modal">
      <h1>Welcome to SpotIci</h1>
      <h3>Please log in to continue:</h3>
      <form @submit.prevent="processLogin">
        <label>
          Username or email:
          <input v-model="usernameOrEmail" type="text" placeholder="Username or email" required>
        </label>
        <label>
          Password
          <input v-model="password" type="password" placeholder="password" required>
        </label>
        <input type="submit" value="Log In">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginView',
  components: {},
  methods: {
    async processLogin() {
      if (!this.usernameOrEmail || !this.password)return;
      const Auth = fetch("http://localhost:3000/v1/users/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.usernameOrEmail,
            password: this.password,
          })
      });
      try {
        const Response = await Auth;
        if (Response.status == 200) {
          const Data = (await Response.json()).data;
          this.$store.commit("login", Data.token.access_token);
        } else {
          //Could not login
        }
      } catch(error) {
        //Error while logging in
      }
    }
  },
  data() {
    return {
      loginMode: true,
      registerMode: false,
      forgotPasswordMode: false,
      usernameOrEmail: null,
      password: null
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .login {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
 }

 .login-modal {
    background-color: var(--item-background-color);
    padding: 10px;
    border-radius: 10px;
    min-width: 40%;
    min-height: 60%;
    display: flex;
    align-items: center;
    flex-direction: column;

    form {
      display: flex;
      align-items: center;
      flex-direction: column;

      label {
        display: flex;
        align-items: center;
        flex-direction: column;
      }
    }
 }
</style>
