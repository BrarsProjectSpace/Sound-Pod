// -------------------------
// VARIABLES
// -------------------------
let songSection = document.querySelector('.song-section');
let audioPlayer = document.getElementById('audio-player');
let currentIndex = 0;
let songs = [];

const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const nextBtn = document.querySelector('.next-btn');
const backBtn = document.querySelector('.back-btn');
const seekbar = document.getElementById('seekbar');

// Disable seekbar initially
seekbar.disabled = true;

// -------------------------
// FETCH SONGS
// -------------------------
async function getSongs() {
    let folder = await fetch("http://127.0.0.1:3000/songs");
    let response = await folder.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let aTags = div.getElementsByTagName('a');
    let songs = [];

    for (let i = 1; i < aTags.length; i++) {
        const element = aTags[i];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }

    return songs;
}

// -------------------------
// MAIN FUNCTION TO CREATE CARDS
// -------------------------
async function main() {
    songs = await getSongs();

    songs.forEach((songUrl, index) => {
        // CARD
        let card = document.createElement('div');
        card.classList.add('card');
        card.style.position = 'relative'; // for overlay

        // IMAGE
        let imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        // SONG NAME
        let fileName = decodeURIComponent(songUrl.split('/').pop().replace('.mp3', ''));
        let songNameText = fileName.split(' - ')[0];
        let songName = document.createElement('p');
        songName.classList.add('song-name');
        songName.textContent = songNameText;

        // PLAYLIST
        let playlistText = fileName.split(' - ')[1].split(' _ ')[0].trim();
        let playlist = document.createElement('p');
        playlist.classList.add('artist-name');
        playlist.textContent = playlistText;

        // ARTIST
        let artistText = fileName.split(' _ ')[1];
        let artistName = document.createElement('p');
        artistName.classList.add('artist-name');
        artistName.textContent = artistText;

        // OVERLAY ICON
        let overlay = document.createElement('div');
        overlay.classList.add('play-overlay');
        overlay.innerHTML = '<i class="fa-solid fa-circle-play overlay-icon"></i>';
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.fontSize = '40px';
        overlay.style.color = 'white';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s ease';

        // APPEND ELEMENTS TO CARD
        card.appendChild(imgDiv);
        card.appendChild(songName);
        card.appendChild(playlist);
        card.appendChild(artistName);
        card.appendChild(overlay);

        // CLICK EVENT TO PLAY SONG
        card.addEventListener('click', () => {
            currentIndex = index;
            playSong(currentIndex);
        });

        // APPEND CARD TO SONG SECTION
        songSection.appendChild(card);
    });
}

main();

// -------------------------
// PLAY SONG FUNCTION
// -------------------------
function playSong(index) {
    audioPlayer.src = songs[index];
    audioPlayer.play();
    seekbar.disabled = false;
    togglePlayPauseIcons(true);

    // Show overlay on current card, hide others
    document.querySelectorAll('.card').forEach((card, i) => {
        let overlay = card.querySelector('.play-overlay');
        overlay.style.opacity = i === index ? '1' : '0';
    });
}

// -------------------------
// TOGGLE PLAY/PAUSE ICONS
// -------------------------
function togglePlayPauseIcons(isPlaying) {
    if (isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    } else {
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    }
}

// -------------------------
// CONTROL BUTTONS
// -------------------------
playBtn.addEventListener('click', () => {
    if (!audioPlayer.src) {
        playSong(currentIndex); // play first song
    } else if (audioPlayer.paused) {
        audioPlayer.play();
        togglePlayPauseIcons(true);
    }
});

pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
    togglePlayPauseIcons(false);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
});

backBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
});

// -------------------------
// AUDIO EVENTS
// -------------------------
audioPlayer.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
});

// -------------------------
// SEEKBAR FUNCTIONALITY
// -------------------------
audioPlayer.addEventListener('timeupdate', () => {
    seekbar.max = audioPlayer.duration || 0;
    seekbar.value = audioPlayer.currentTime;

    let percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.style.background = `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percent}%, var(--color-seekbar-bg) ${percent}%, var(--color-seekbar-bg) 100%)`;
});

seekbar.addEventListener('input', () => {
    audioPlayer.currentTime = seekbar.value;
});
