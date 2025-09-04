// let url = 'https://brarsprojectspace.github.io/Sound-Pod'

let songSection = document.querySelector('.song-section');
let audioPlayer = document.getElementById('audio-player');
let currentIndex = 0;
let songs = [];


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
    songs = await getsongs();
    // console.log(songs);

    songs.forEach((songUrl, index) => {
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

        card.addEventListener('click', () => {
            currentIndex = index;
            playSong(currentIndex);
        })

        // Append card to song-section
        songSection.appendChild(card);

    })
}

main();


function playSong(index) {
    audioPlayer.src = songs[index];
    audioPlayer.play();
    updateControls();
}
function updateControls() {
    document.querySelector('.play-btn').style.display = 'none';
    document.querySelector('.pause-btn').style.display = 'inline-block';
}

const playbtn = document.querySelector('.play-btn');
const pausebtn = document.querySelector('.pause-btn');
const nextbtn = document.querySelector('.next-btn');
const backbtn = document.querySelector('.back-btn');


playbtn.addEventListener('click', () => {
    audioPlayer.play();
    updateControls();
});

pausebtn.addEventListener('click', () => {
    audioPlayer.pause();
    playbtn.style.display = 'inline-block';
    pausebtn.style.display = 'none';
});

nextbtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
});

backbtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
});

audioPlayer.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
});


// seek bar
const seekbar = document.getElementById('seekbar');

audioPlayer.addEventListener('timeupdate', () => {
    // update seekbar max and value
    seekbar.max = audioPlayer.duration || 0;
    seekbar.value = audioPlayer.currentTime;
});

seekbar.addEventListener('input', () => {
    audioPlayer.currentTime = seekbar.value;
});

audioPlayer.addEventListener('timeupdate', () => {
    let percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.style.background = `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percent}%, var(--color-seekbar-bg) ${percent}%, var(--color-seekbar-bg) 100%)`;
});
