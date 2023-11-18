namespace SpotIci {
    interface Track {
        id: string;
        name: string;
        album: Album;
        albumName: string;
        artists: Array<Artist>;
        artistsNames: string;
        duration_ms: number;
        release: string;
    }

    interface Album {
        id: string;
        name: string;
        artists: Array<Artist>;
        release: string;
    }

    interface Artist {
        id: string;
        name: string;
    }

    interface LibraryQueryResult {
        tracks: Array<SpotIci.Track>;
        albums: Array<SpotIci.Album>;
        artists: Array<SpotIci.Artist>;
        playlists: Array<any>;
    }
}
