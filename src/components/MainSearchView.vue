<template>
  <div class="home">
    <input @keyup="search()" v-model="searchQuery" class="search-bar" type="test" placeholder="Title, Artist, Album, Playlist"/>
    <TrackView v-bind:key="track.id" v-bind:track="track" v-for="track in tracks"/>
    <LoadMoreView v-if="loadMore" @click.shift="searchS()" @click="search(true)"/>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    .search-bar {
      font-family: 'Rubik', sans-serif;
      margin: 0 var(--panel-gap) 0 var(--panel-gap);
      padding: var(--panel-gap);
      border: none;
      outline: none;
      border-radius: var(--panel-gap);
      background-color: var(--tertiary-background-light);
      border: 2px solid var(--secondary-background-main);
      color: var(--light-color-lighter);
      margin-bottom: var(--panel-gap);
    }
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import TrackView from './TrackView.vue';
import LoadMoreView from './LoadMoreView.vue';

export default defineComponent({
  name: 'MainSearchView',
  components: { TrackView, LoadMoreView },
  data() {
    return {
      searchQuery: "",
      searching: false
    }
  },
  computed: {
    loadMore(): boolean {
      return this.searchQuery.trim() != "";
    },
    tracks(): Array<any> {
      return this.$store.state.app.searchResults.tracks
    },
    albums(): Array<any> {
      return this.$store.state.app.searchResults.albums
    },
    artists(): Array<any> {
      return this.$store.state.app.searchResults.artists
    },
  },
  methods: {
    async search(force=false) {
      if (!this.searchQuery || this.searching)return;
      let SearchURL = (force) ? `http://localhost:3000/v1/library/query/${this.searchQuery}/${this.tracks.length}` : `http://localhost:3000/v1/library/query/${this.searchQuery}`;
      const SearchQuery = fetch(SearchURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.$store.state.auth.access_token
          }
      });
      try {
        this.searching = true;
        const Response = await SearchQuery;
        this.searching = false;
        if (Response.status == 200) {
          const Data = (await Response.json()).data;
          if (!force)this.$store.commit("setSearchResults", Data);
          if (force)this.$store.commit("addSearchResults", Data);
        } else {
          //Could not fetch
        }
      } catch(error) {
        this.searching = false;
      }
    },
    async searchS() {
      if (!this.searchQuery || this.searching)return;
      const SearchQuery = fetch(`http://localhost:3000/v1/library/query/${this.searchQuery}/force`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.$store.state.auth.access_token
          }
      });
      try {
        this.searching = true;
        const Response = await SearchQuery;
        this.searching = false;
        if (Response.status == 200) {
          const Data = (await Response.json()).data;
          this.$store.commit("addSearchResults", Data);
        } else {
          //Could not fetch
        }
      } catch(error) {
        this.searching = false;
      }
    }
  }
});
</script>