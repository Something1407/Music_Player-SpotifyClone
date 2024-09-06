console.log("something");
// window.addEventListener('scroll', () => {
//     const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
//     const hue = Math.floor(scrollPercentage * 3.6); // 360 degrees / 100 = 3.6
//     document.documentElement.style.setProperty('--scrollbar-color', `hsl(${hue}, 70%, 60%)`);
// });

let currentSong = new Audio();

function formatTime(seconds) {
    // Round seconds to the nearest integer
    seconds = Math.round(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad both minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/") || await fetch("https://github.com/Something1407/Music_Player-SpotifyClone/tree/main/songs/")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}



const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".songtext").innerHTML = decodeURI(track);
}


async function main() {
    let songs = await getSongs();
    // console.log(songs);
    // playMusic(songs[0], true);
    let container = document.querySelector(".cardContainer");
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        const randomNumber = Math.floor(Math.random() * 1000);
        // let songCuted = song.slice(0, -4);
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img src="music.svg" alt="music_photo">
        <div class="info">
        <span>${song.replaceAll("%20", " ")} </span>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <button>
        <img class="invert-img" src="play-circle.svg" alt="play_button">
        </button>
        </div></li>`;
        container.innerHTML = container.innerHTML + `<div class="card rounded">
        <img class="rounded" src="https://picsum.photos/seed/${randomNumber}/500/500" alt="songs img">
        <button class="playBtn">
        <img src="play.svg" alt="playbutton">
        </button>
        <h3 class="info_card">${song.replaceAll("%20", " ")}</h3>
        </div>`;
        // <img class="rounded" src="https://picsum.photos/seed/${randomSeed}/500/500" alt="songs img">
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    });

    Array.from(document.querySelectorAll(".cardContainer .playBtn")).forEach(button => {
        button.addEventListener("click", (event) => {
            // Prevent event bubbling to the card itself if any
            event.stopPropagation();

            const trackName = button.parentElement.querySelector(".info_card").innerHTML.trim();
            console.log(trackName);
            playMusic(trackName);
        });
    });
    // Array.from(document.querySelector(".cardContainer button")).forEach(e => {
    //     e.addEventListener("click", (element) => {
    //         console.log(e.querySelector(".info_card").innerHTML);
    //         playMusic(e.querySelector(".info_card").innerHTML.trim());
    //     })

    // });

    // function addEventListeners() {
    //     // Select both .songList li elements and the #playBtnCard element
    //     const elements = Array.from(document.querySelectorAll(".songList li, #playBtnCard"));

    //     elements.forEach(e => {
    //         e.addEventListener("click", (element) => {
    //             let trackName;
    //             if (e.classList.contains("info_card")) {
    //                 // For #playBtnCard, use .info_card
    //                 trackName = e.querySelector(".info_card").innerHTML.trim();
    //             } else {
    //                 // For .songList li, use .info
    //                 trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
    //             }
    //             console.log(trackName);
    //             playMusic(trackName);
    //         });
    //     });
    // }

    // addEventListeners();
    // adding play,previous and forward buttons
    play.addEventListener("click", (element) => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });


    // listen a time update Event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songruntime").innerHTML = `${formatTime(currentSong.currentTime)}`;
        document.querySelector(".songtotalduration").innerHTML = `${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // add an event listner to the seekbar to seek the circle


    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentage + "%";
        currentSong.currentTime = ((currentSong.duration) * percentage) / 100;
    });

    // Update seekbar and time display
    currentSong.addEventListener("timeupdate", () => {
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;
        const progressPercentage = (currentTime / duration) * 100;

        document.querySelector(".songruntime").innerHTML = formatTime(currentTime);
        document.querySelector(".songtotalduration").innerHTML = formatTime(duration);
        circle.style.left = `${progressPercentage}%`;
    });

    changeimage_seekbar();
    clickedMusic();
}


function clickedMusic() {
    let clicksongs = document.querySelectorAll("#song_bar");
    clicksongs.forEach((clicksong, index) => {
        console.log(`Song item ${index + 1} clicked`);
        clicksong.addEventListener("click", () => {
            document.querySelector(".playbar").style.visibility = "visible";
        });
    });
}

function changeimage_seekbar() {
    let changeimg = document.querySelectorAll("#song_bar");
    let changeimage = document.querySelectorAll(".cardContainer .playBtn");
    changeimg.forEach((changeimg) => {
        changeimg.addEventListener("click", () => {
            const randomNumber = Math.floor(Math.random() * 1000);
            let songinfoimg = document.querySelector(".songinfoimg");
            songinfoimg.innerHTML = `<img src="https://picsum.photos/seed/${randomNumber}/500/500" alt="song info image">`
        });
    });
    changeimage.forEach((changeimg) => {
        changeimg.addEventListener("click", () => {
            const randomNumber = Math.floor(Math.random() * 1000);
            let songinfoimg = document.querySelector(".songinfoimg");
            songinfoimg.innerHTML = `<img src="https://picsum.photos/seed/${randomNumber}/500/500" alt="song info image">`
        });
    });
}



main();
playMusic();