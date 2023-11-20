<template>
  <div class="load-more">
    <div class="refresh-button">
      <font-awesome-icon icon="fa-solid fa-rotate"/>
    </div>
    <div class="track-infos">
      Load More
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadMoreView',
  components: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .load-more {
    background-color: #00000036;
    border: none;
    outline: none;
    color: var(--light-color-lighter);
    height: fit-content;
    margin: var(--panel-gap);
    padding: 5px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition-duration: .2s;
    cursor: pointer;

    &:hover {
      background-color: #0000007a;
      color: var(--accent-color);
    }
    
    &:active {
      background-color: #000000c2;
    }

    .refresh-button {
      margin-left: 10px;
      margin-right: 10px;
    }

    .track-infos {
      display: flex;
      flex-direction: column;
      font-family: 'Rubik', sans-serif;
    }
  }
</style>
