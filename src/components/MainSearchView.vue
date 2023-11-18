<template>
  <div class="home">
    <input @keyup="search()" v-model="searchQuery" class="search-bar" type="test" placeholder="Title, Artist, Album, Playlist"/>
    <TrackView v-bind:key="track.id" v-bind:track="track" v-for="track in tracks"/>
    <LoadMoreView v-if="loadMore" @click="search(true)"/>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
      let SearchURL = (force) ? `http://localhost:3000/v1/library/query/${this.searchQuery}/force` :  `http://localhost:3000/v1/library/query/${this.searchQuery}`;
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
    }
  }
});
</script>