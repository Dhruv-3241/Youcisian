console.log("Welcome to Online Piano");

const pianoKeys = document.querySelectorAll(".piano-keys .key"),
    volumeSlider = document.querySelector(".volume-slider input"),
    keysCheckbox = document.querySelector(".keys-checkbox input");

const keymap = new Map();
//by default, audio src is "a" tune.
let allKeys = [];
let audiomap = new Map(); 
    // audio = new Audio("tunes/a.mp3");

var type = "tunes";

Audio.prototype.stop = function () {
    this.pause();
    this.currentTime = 0.0;
}

const playTune = (key) => {
    const audio = audiomap.get(key);
    console.log(key, "on");
    // audio.src = `tunes/${key}.mp3`; //passing the audio src based on the key
    audio.play(); //playing audio
    // audio.onended = () => { //removing active class after audio ends
    //     audio.play();
    // }

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    // passing audio src based on key pressed
    clickedKey.classList.add("active");
    // setTimeout(() => { //removing active class after 150ms from the clicked element
    //     clickedKey.classList.remove("active");
    // }, 150);
}

pianoKeys.forEach(key => {
    //adding data-key value to allKeys array
    allKeys.push(key.dataset.key);
    //calling playTune function with passing data-key value as an argument
    // key.addEventListener("click", () => playTune(key.dataset.key));
    // key.addEventListener("keyup", playKeyUpTune(key.dataset.key));
    // key.addEventListener("keydown", playKeyDownTune(key.dataset.key));
    key.addEventListener("mousedown", () => {
        console.log("mouse triggered");
        playTune(key.dataset.key);
    });
    key.addEventListener("mouseup", () => {
        console.log("mouse leaved");
        playOffTune(key.dataset.key);
    });
    audiomap.set(key.dataset.key, new Audio(`tunes/${key.dataset.key}.mp3`));
});

document.addEventListener("keyup", (key) => {
    let clicked = document.querySelector(`[data-key="${String.fromCharCode(key.keyCode).toLowerCase()}"]`);
    clicked = clicked.dataset.key;
    console.log(clicked, "up");
    playKeyUpTune(clicked);
});

document.addEventListener("keydown", (key) => {
    console.log(key.repeat);
    if (key.repeat) {
        return; 
    }
    else {
        console.log(String.fromCharCode(key.keyCode));
        let clicked = document.querySelector(`[data-key="${String.fromCharCode(key.keyCode).toLowerCase()}"]`);
        clicked = clicked.dataset.key;
        console.log(clicked, "down");
        playKeyDownTune(clicked);
    }
});

// document.addEventListener("keydown", playKeyDownTune(key.dataset.key));

const handleVolume = (e) => {
    audio.volume = e.target.value; //passing the range slider value as an audio volume
}

const showHideKeys = () => {
    //toggling hide class from each key on the checkbox click
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

// const pressedKey = (e) => {
//     //checking if the key pressed is in allKeys array, only call the playTune function
//     if (allKeys.includes(e.key)) playTune(e.key);
// }

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);

const intype = document.querySelector("#intype");
intype.addEventListener("change", (e) => {
    changetype(e.target.value);
});
// document.addEventListener("keydown", pressedKey);

function playKeyUpTune(key) {
    if (keymap.get(key) == true) {
        playOffTune(key);
    }
    keymap.set(key, false);
}

async function playKeyDownTune(key) {
    if (!keymap.get(key)) {
        playTune(key);
    }
    keymap.set(key, true);
}

async function playOffTune(key) {
    const audio = audiomap.get(key);
    console.log(key, "off");
    audio.onended = () => {};
    await wait(500);
    audio.stop();
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.remove("active");
}

const wait= async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changetype(t){
    if (t == "piano") {
        type = "tunes";
    }
    else {
        type = "guitartune";
    }
    pianoKeys.forEach(key => {
        audiomap.set(key.dataset.key, new Audio(`${type}/${key.dataset.key}.mp3`));
    });
}