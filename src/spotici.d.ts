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
        buffer?: ArrayBuffer | Promise<ArrayBuffer>;
        track_number: number;
        disc_number: number;
    }

    interface Album {
        id: string;
        name: string;
        artists: Array<Artist>;
        release: string;
        total_tracks: number;
        image: string | undefined;
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
