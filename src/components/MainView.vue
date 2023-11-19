<template>
  <div class="grid-item main" v-if="isLoggedIn">
    <MainHeaderView/>
    <MainHomeView v-if="options?.home"/>
    <MainSearchView v-if="options?.search" v-bind:options="options.search"/>
    <MainQueueView v-if="options?.queue"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainHeaderView from '@/components/MainHeaderView.vue';
import MainHomeView from '@/components/MainHomeView.vue';
import MainSearchView from '@/components/MainSearchView.vue';
import MainQueueView from './MainQueueView.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    MainHeaderView,
    MainHomeView,
    MainSearchView,
    MainQueueView
  },
  props: {
    options: Object
  },
  computed: {
    app() { 
      return this.$store.state.app;
    },
    isLoggedIn(): boolean {
      return this.$store.getters.isLoggedIn;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 .main {
    border-radius: 10px;
    background-color: var(--item-background-color);
    grid-area: main-view;

    background: linear-gradient(45deg, rgba(12, 60, 125, 1), rgba(107, 17, 17,1));
    background-size: 400% 400%;

    -webkit-animation: Gradient 5s ease infinite;
    -moz-animation: Gradient 5s ease infinite;
    animation: Gradient 5s ease infinite;

    overflow-y: scroll;
 }

@-webkit-keyframes Gradient {
  0%{background-position:62% 0%}
  50%{background-position:39% 100%}
  100%{background-position:62% 0%}
}
@-moz-keyframes Gradient {
  0%{background-position:62% 0%}
  50%{background-position:39% 100%}
  100%{background-position:62% 0%}
}
@keyframes Gradient { 
  0%{background-position:62% 0%}
  50%{background-position:39% 100%}
  100%{background-position:62% 0%}
}
</style>
