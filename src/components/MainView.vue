<template>
  <div class="grid-item main">
    <MainHeaderView/>
    <MainHomeView v-if="app.view == '/home'"/>
    <MainSearchView v-if="app.view == '/search'"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainHeaderView from './MainHeaderView.vue';
import MainHomeView from './MainHomeView.vue';
import MainSearchView from './MainSearchView.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    MainHeaderView,
    MainHomeView,
    MainSearchView
  },
  computed: {
    app() { 
      return this.$store.state.app;
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
