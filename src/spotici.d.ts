namespace SpotIci {
    interface Track {
        buffer?: any;
        id: string;
        name: string;
        album: Album;
        artists: Artist[];
        duration_ms: number;
        disc_number: number;
        track_number: number;
        explicit: boolean;
    }

    interface Album {
        id: string;
        name: string;
        artists: Artist[];
        release_date: string;
        release_date_precision: string;
        tracks: Track[];
    }

    interface Artist {
        id: string;
        name: string;
        albums: Album[];
        tracks: Track[];
    }

    interface LibraryQueryResult {
        tracks: Array<SpotIci.Track>;
        albums: Array<SpotIci.Album>;
        artists: Array<SpotIci.Artist>;
        playlists: Array<any>;
    }
}
