export default class Sound {
    constructor(file) {
        this.audio = new Audio(file);
    }

    loadForSafari() {
        this.audio.play();
        setTimeout(()=> {
            this.audio.pause();
        }, 1);
    }

    replay() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();
    }
}