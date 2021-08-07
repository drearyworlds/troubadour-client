import { Song } from '../json-schema/song'

export function songDefaultComparator(song1: Song, song2: Song) {
    if (song1 && song2) {
        // Put active songs above inactive songs
        if (song1.active != song2.active) {
            return song1.active ? -1 : 1;
        }

        let song1SortArtist = song1.artist;
        let song2SortArtist = song2.artist;
        let song1SortTitle = song1.title;
        let song2SortTitle = song2.title;

        if (song1SortArtist.match("A ",)) {
            song1SortArtist = song1SortArtist.substring(2)
        } else if (song1SortArtist.match("An ",)) {
            song1SortArtist = song1SortArtist.substring(3)
        } else if (song1SortArtist.match("The ",)) {
            song1SortArtist = song1SortArtist.substring(4)
        }

        if (song2SortArtist.match("A ",)) {
            song2SortArtist = song2SortArtist.substring(2)
        } else if (song2SortArtist.match("An ",)) {
            song2SortArtist = song2SortArtist.substring(3)
        } else if (song2SortArtist.match("The ",)) {
            song2SortArtist = song2SortArtist.substring(4)
        }

        if (song1SortArtist > song2SortArtist) {
            return 1;
        } else if (song1SortArtist < song2SortArtist) {
            return -1;
        } else {
            if (song1SortTitle > song2SortTitle) {
                return 1;
            } else if (song1SortTitle < song2SortTitle) {
                return -1;
            }
        }
    }

    return 0;
}