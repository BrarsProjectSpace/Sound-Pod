// -------------------------
// VARIABLES
// -------------------------
let songSection = document.querySelector('.song-section'); // Container for song cards
let audioPlayer = document.getElementById('audio-player'); // The audio element
let currentIndex = 0; // Currently playing song index
let songs = []; // Array to store song URLs

// Main control buttons
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const nextBtn = document.querySelector('.next-btn');
const backBtn = document.querySelector('.back-btn');

const seekbar = document.getElementById('seekbar'); // Seek bar for song progress
seekbar.disabled = true; // Disabled initially because no song is loaded

// -------------------------
// FETCH SONGS FROM SERVER
// -------------------------
async function getSongs() {
    let folder = await fetch("http://127.0.0.1:3000/songs"); // Fetch folder contents
    let response = await folder.text();

    let div = document.createElement("div"); // Temporary div to parse HTML
    div.innerHTML = response;

    let aTags = div.getElementsByTagName('a');
    let songs = [];

    // Collect only .mp3 links
    for (let i = 1; i < aTags.length; i++) {
        const element = aTags[i];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }

    return songs;
}

// -------------------------
// CREATE SONG CARDS
// -------------------------
async function main() {
    songs = await getSongs();

    songs.forEach((songUrl, index) => {
        // Create card container
        let card = document.createElement('div');
        card.classList.add('card');
        card.style.position = 'relative'; // Needed for overlay positioning

        // Image placeholder
        let imgDiv = document.createElement('div');
        imgDiv.classList.add('img');

        // Extract song details from filename
        let fileName = songUrl.split('/').pop().replaceAll('.mp3', '');
        let decodedFile = decodeURIComponent(fileName);

        let songName = document.createElement('p');
        songName.classList.add('song-name');
        songName.textContent = decodedFile.split(' - ')[0]; // Song title

        let playlist = document.createElement('p');
        playlist.classList.add('artist-name');
        playlist.textContent = decodedFile.split(' - ')[1].split(' _ ')[0].trim(); // Playlist name

        let artistName = document.createElement('p');
        artistName.classList.add('artist-name');
        artistName.textContent = decodedFile.split(' _ ')[1]; // Artist name

        // -------------------------
        // OVERLAY PLAY/PAUSE BUTTON
        // -------------------------
        let overlay = document.createElement('div');
        overlay.classList.add('play-overlay');
        overlay.innerHTML = '<i class="fa-solid fa-circle-play overlay-icon"></i>';
        overlay.style.position = 'absolute';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.fontSize = '24px';
        overlay.style.color = 'var(--color-accent)';
        overlay.style.cursor = 'pointer';
        overlay.style.transition = 'transform 0.2s ease';

        // Overlay click toggles play/pause
        overlay.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click from firing
            if (currentIndex !== index) {
                // If clicking on a different song, play that song
                currentIndex = index;
                playSong(currentIndex);
            } else {
                // Toggle play/pause for current song
                if (audioPlayer.paused) {
                    audioPlayer.play();
                } else {
                    audioPlayer.pause();
                }
                updateControls();
                updateOverlayIcons();
            }
        });

        // -------------------------
        // CARD CLICK (PLAY SONG)
        // -------------------------
        card.addEventListener('click', () => {
            currentIndex = index;
            playSong(currentIndex);
        });

        // Append all elements to card
        card.appendChild(imgDiv);
        card.appendChild(songName);
        card.appendChild(playlist);
        card.appendChild(artistName);
        card.appendChild(overlay);

        // Append card to the song section
        songSection.appendChild(card);
    });
}

// -------------------------
// PLAY SONG FUNCTION
// -------------------------
function playSong(index) {
    audioPlayer.src = songs[index]; // Set audio source
    audioPlayer.play(); // Play audio
    seekbar.disabled = false; // Enable seekbar now
    updateControls(); // Update main play/pause buttons
    updateOverlayIcons(); // Update card overlay icons
}

// -------------------------
// UPDATE MAIN PLAY/PAUSE CONTROLS
// -------------------------
function updateControls() {
    playBtn.style.display = audioPlayer.paused ? 'inline-block' : 'none';
    pauseBtn.style.display = audioPlayer.paused ? 'none' : 'inline-block';
}

// -------------------------
// UPDATE CARD OVERLAY ICONS
// -------------------------
function updateOverlayIcons() {
    document.querySelectorAll('.card').forEach((card, i) => {
        let overlayIcon = card.querySelector('.overlay-icon');
        if (i === currentIndex) {
            overlayIcon.className = audioPlayer.paused
                ? 'fa-solid fa-circle-play overlay-icon'
                : 'fa-solid fa-pause overlay-icon';
        } else {
            overlayIcon.className = 'fa-solid fa-circle-play overlay-icon';
        }
    });
}

// -------------------------
// MAIN CONTROL BUTTON EVENTS
// -------------------------
playBtn.addEventListener('click', () => {
    if (!audioPlayer.src) {
        playSong(currentIndex); // Play first song if none loaded
    } else {
        audioPlayer.play();
        updateControls();
        updateOverlayIcons();
    }
});

pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
    updateControls();
    updateOverlayIcons();
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
// AUTO PLAY NEXT SONG WHEN CURRENT ENDS
// -------------------------
audioPlayer.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
});

// -------------------------
// SEEK BAR FUNCTIONALITY
// -------------------------
audioPlayer.addEventListener('timeupdate', () => {
    seekbar.max = audioPlayer.duration || 0;
    seekbar.value = audioPlayer.currentTime;

    // Update seekbar gradient
    let percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekbar.style.background = `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percent}%, var(--color-seekbar-bg) ${percent}%, var(--color-seekbar-bg) 100%)`;
});

seekbar.addEventListener('input', () => {
    audioPlayer.currentTime = seekbar.value;
});

// -------------------------
// INITIALIZE APP
// -------------------------
main();
