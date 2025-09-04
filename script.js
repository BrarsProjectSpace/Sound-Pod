// let url = 'https://brarsprojectspace.github.io/Sound-Pod'

let songSection = document.querySelector('.song-section')


async function getsongs() {
    let folder = await fetch("http://127.0.0.1:3000/songs")
    let response = await folder.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let aTags = div.getElementsByTagName('a');
    let songs = [];

    for (let index = 1; index < aTags.length; index++) {
        const element = aTags[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }

    return songs;

}

async function main() {
    let songs = await getsongs();
    // console.log(songs);

    songs.forEach(songUrl => {
        let card = document.createElement('div');
        card.classList.add('card');

        let imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        let songName = document.createElement('p');
        songName.classList.add('song-name');
        let fileName = songUrl.split('/').pop().replaceAll('.mp3', '');
        let song = decodeURIComponent(fileName).split(' - ')[0];
        songName.textContent = song;

        //playlist name placeholder
        let playlist = document.createElement('p');
        playlist.classList.add('artist-name');
        let playlisttext = decodeURIComponent(fileName).split(' - ')[1].split(' _ ')[0].trim();
        playlist.textContent = playlisttext

        // Artist name placeholder
        let artistName = document.createElement('p');
        artistName.classList.add('artist-name');
        artistName.textContent = decodeURIComponent(fileName).split(' _ ')[1];

        // Append elements to card
        card.appendChild(imgDiv);
        card.appendChild(songName);
        card.appendChild(playlist);
        card.appendChild(artistName);

        // Append card to song-section
        songSection.appendChild(card);

    })
}

main();