import Tetromino from 'javascripts/tetromino';
import TetrisMap from 'javascripts/tetrismap';
import Controller from 'javascripts/controller';
import Sound from 'javascripts/sound';

export default class Tetris {
    constructor(options) {
        this.options = options;

        this._initInterface();
        this._initGame();
    }

    _initInterface() {
        const gameArea = document.getElementById(this.options.gameArea);

        this.canvas = document.createElement('canvas');
        gameArea.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        let tetrominoSize = 0;
        if (document.body.clientWidth <= 700) {
            // mobile device
            tetrominoSize = Math.floor(document.body.clientWidth * 0.85 / 10);
        } else {
            // desktop device
            tetrominoSize = 60;
        }

        const mapWidth = tetrominoSize * 10;
        const mapHeight = tetrominoSize * 20;
        const gap = tetrominoSize * 2;
        const infoWidth = tetrominoSize * 6;

        this.canvas.width = mapWidth + gap + infoWidth + gap;
        this.canvas.height = mapHeight;
        this.canvas.style.width = this.canvas.width / 2 + 'px';
        this.canvas.style.height = this.canvas.height / 2 + 'px';
    }

    _initGame() {
        this.map = new TetrisMap(this.canvas.height / 20, this.ctx);

        this.map._drawBackground();
    }

    set options(_options) {
        const options = {
            gameArea: ''
        };

        for (let key in options) {
            if (_options[key] !== undefined) {
                options[key] = _options[key];
            }
        }

        this._options = options;
    }

    get options() {
        return this._options;
    }
}