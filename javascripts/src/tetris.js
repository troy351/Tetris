import Tetromino from 'javascripts/tetromino';
import TetrisMap from 'javascripts/tetrismap';
import Controller from 'javascripts/controller';
import Sound from 'javascripts/sound';

export default class Tetris {
    constructor(options) {
        this.options = options;

        this._initInterface();
        this._initGame();
        this._startGame();
    }

    _initInterface() {
        const gameArea = document.getElementById(this.options.gameArea);

        this.canvas = document.createElement('canvas');
        this.canvas.innerText = 'Your browser doesn\'t support html5 canvas, please upgrade your browser.';
        gameArea.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.gameConfig = {};
        this.gameConfig.rows = 20;
        this.gameConfig.columns = 10;
        let tetrominoSize = 0;
        if (document.body.clientWidth <= 767) {
            // phone
            tetrominoSize = Math.floor(document.body.clientWidth * 0.85 / this.gameConfig.columns);
        } else if (document.body.clientWidth <= 959) {
            // pad
            tetrominoSize = 50;
        } else {
            // desktop
            tetrominoSize = 60;
        }

        this.gameConfig.tetrominoSize = tetrominoSize;
        this.gameConfig.mapWidth = tetrominoSize * this.gameConfig.columns;
        this.gameConfig.mapHeight = tetrominoSize * this.gameConfig.rows;
        this.gameConfig.gap = tetrominoSize * 2;
        this.gameConfig.infoWidth = tetrominoSize * 6;

        this.canvas.width = this.gameConfig.mapWidth + this.gameConfig.gap + this.gameConfig.infoWidth + this.gameConfig.gap;
        this.canvas.height = this.gameConfig.mapHeight;
        this.canvas.style.width = this.canvas.width / 2 + 'px';
        this.canvas.style.height = this.canvas.height / 2 + 'px';
    }

    _initGame() {
        const tetrominoSize = this.gameConfig.tetrominoSize;
        const ctx = this.ctx;

        this.map = new TetrisMap(this.gameConfig, ctx);

        this.map.drawBackground();
        this.map.draw();

        const drawLeftText = (color, text, size, y)=> {
            ctx.fillStyle = color;
            ctx.font = `bold ${size}px Arial`;
            ctx.textBaseline = 'top';
            // const mt = ctx.measureText(text);
            ctx.fillText(text, this.gameConfig.mapWidth + this.gameConfig.gap, y);
        };

        drawLeftText('black', 'NEXT', tetrominoSize, tetrominoSize * 2);
        drawLeftText('black', 'SPEED', tetrominoSize, tetrominoSize * 11);
        drawLeftText('black', 'SCORE', tetrominoSize, tetrominoSize * 15);

        // get a random tetromino
        this.tetromino = new Tetromino(this.gameConfig, this.ctx);
        this.nextTetromino = new Tetromino(this.gameConfig, this.ctx);

        // draw next tetromino
        this._drawNextTetromino();
    }

    _startGame() {
        Controller.addListener(this.canvas, (direction)=> {
            switch (direction) {
                case 'left':
                    if (this.map.canTetrominoMove(this.tetromino, -1, 0)) {
                        this.tetromino.move(-1, 0);
                    }
                    break;
                case 'right':
                    if (this.map.canTetrominoMove(this.tetromino, 1, 0)) {
                        this.tetromino.move(1, 0);
                    }
                    break;
                case 'down':
                    if (this.map.canTetrominoMove(this.tetromino, 0, 3)) {
                        // can down 3 blocks
                        this.tetromino.move(0, 3);
                    } else {
                        // less than 3 blocks reach bottom
                        while (this.map.canTetrominoMove(this.tetromino, 0, 1)) {
                            this.tetromino.move(0, 1);
                        }
                    }
                    break;
                case 'up':
                    if (this.map.canTetrominoTransform(this.tetromino)) {
                        this.tetromino.setShape(this.tetromino.getNextShape());
                    }
                    break;
            }

            // draw
            this.map.drawBackground();
            this.map.draw();
            this.tetromino.draw();
        });

        // tetromino auto down
        setInterval(()=> {
            if (!this.map.canTetrominoMove(this.tetromino, 0, 1)) {
                // reach bottom
                this.map.setTetrominoToMap(this.tetromino, ()=> {
                    // create a new tetromino
                    this.tetromino = this.nextTetromino;
                    this.nextTetromino = new Tetromino(this.gameConfig, this.ctx);
                    // draw next tetromino
                    this._drawNextTetromino();
                });
            } else {
                // down one block
                this.tetromino.move(0, 1);
            }

            // draw
            this.map.drawBackground();
            this.map.draw();
            this.tetromino.draw();
        }, 1000);
    }

    _drawNextTetromino() {
        const ctx = this.ctx;
        const config = this.gameConfig;
        const size = config.tetrominoSize;

        // clean area
        ctx.clearRect(config.columns * size + config.gap, size * 5, size * 4, size * 4);

        // draw next tetromino
        this.nextTetromino.draw(config.columns + config.gap / size + 2, 5 + 2);
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