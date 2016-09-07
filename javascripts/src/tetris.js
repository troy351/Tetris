import Tetromino from 'javascripts/tetromino';
import TetrisMap from 'javascripts/tetrismap';
import Controller from 'javascripts/controller';
import Sound from 'javascripts/sound';

export default class Tetris {

    constructor(options) {
        this.options = options;

        this._initInterface();
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
            tetrominoSize = 2 * Math.floor(document.body.clientWidth * 0.85 / (this.gameConfig.columns + 6));
        } else if (document.body.clientWidth <= 959) {
            // pad
            tetrominoSize = 56;
        } else {
            // desktop
            tetrominoSize = 64;
        }

        this.gameConfig.tetrominoSize = tetrominoSize;
        this.gameConfig.mapWidth = tetrominoSize * this.gameConfig.columns;
        this.gameConfig.mapHeight = tetrominoSize * this.gameConfig.rows;
        this.gameConfig.gap = tetrominoSize;
        this.gameConfig.infoWidth = tetrominoSize * 4;

        this.canvas.width = this.gameConfig.mapWidth + this.gameConfig.gap + this.gameConfig.infoWidth + this.gameConfig.gap;
        this.canvas.height = this.gameConfig.mapHeight;
        this.canvas.style.width = this.canvas.width / 2 + 'px';
        this.canvas.style.height = this.canvas.height / 2 + 'px';

        // controlArea for controller
        Controller.controlArea = {
            top: 197,
            left: (window.innerWidth - this.canvas.width / 2) / 2,
            right: (window.innerWidth + this.canvas.width / 2) / 2,
            bottom: 197 + this.canvas.height / 2
        };

        // first start screen
        this._gameEnd(false);

        // load sound
        this.soundGlint = new Sound('sounds/glint.wav');
        this.soundLand = new Sound('sounds/land.wav');
        this.soundMove = new Sound('sounds/move.wav');
        this.soundTrans = new Sound('sounds/trans.wav');

        // safari won't auto load sound unless user clicked
        // there is a trick that play sound 1ms while user touches canvas first time
        if (navigator.userAgent.match(/(iPad|iPhone)/)) {
            this.canvas.setAttribute('ontouchstart', `
            window.soundMove.loadForSafari();
            window.soundGlint.loadForSafari();
            window.soundLand.loadForSafari();
            window.soundTrans.loadForSafari();
            delete window.soundMove;
            delete window.soundGlint;
            delete window.soundLand;
            delete window.soundTrans;
            this.removeAttribute("ontouchstart");`.replace(/            /g, '').split('\n').join(''));

            window.soundMove = this.soundMove;
            window.soundGlint = this.soundGlint;
            window.soundLand = this.soundLand;
            window.soundTrans = this.soundTrans;
        }
    }

    _resetGameData() {
        const tetrominoSize = this.gameConfig.tetrominoSize;
        const ctx = this.ctx;
        // clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map = new TetrisMap(this.gameConfig, ctx);
        this.map.drawBackground();
        this.map.draw();

        this._drawLeftText('black', 'NEXT', tetrominoSize, 0, tetrominoSize * 2);
        this._drawLeftText('black', 'SPEED', tetrominoSize, 0, tetrominoSize * 11);
        this._drawLeftText('black', 'SCORE', tetrominoSize, 0, tetrominoSize * 15);

        // get a random tetromino
        this.tetromino = new Tetromino(this.gameConfig, this.ctx);
        this.nextTetromino = new Tetromino(this.gameConfig, this.ctx);

        // draw next tetromino
        this._drawNextTetromino();
        // draw speed
        this.count = 1;
        this.speed = 50;
        this._drawLeftText('black', this.speed, tetrominoSize, 1, tetrominoSize * 13);
        // draw score
        this.score = 0;
        this._drawLeftText('black', this.score, tetrominoSize, 1, tetrominoSize * 17);

        localStorage.TetrisUnfinishedGame = true;
    }

    _recoverGameData() {
        const tetrominoSize = this.gameConfig.tetrominoSize;
        const ctx = this.ctx;
        // clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map = new TetrisMap(this.gameConfig, ctx);
        this.map.load('TetrisMap');
        this.map.drawBackground();
        this.map.draw();

        this._drawLeftText('black', 'NEXT', tetrominoSize, 0, tetrominoSize * 2);
        this._drawLeftText('black', 'SPEED', tetrominoSize, 0, tetrominoSize * 11);
        this._drawLeftText('black', 'SCORE', tetrominoSize, 0, tetrominoSize * 15);

        // get a random tetromino
        this.tetromino = new Tetromino(this.gameConfig, this.ctx);
        this.tetromino.load('TetrisTetromino');
        this.nextTetromino = new Tetromino(this.gameConfig, this.ctx);
        this.nextTetromino.load('TetrisNextTetromino');

        // draw next tetromino
        this._drawNextTetromino();
        // draw speed
        this.count = parseInt(localStorage.TetrisCount);
        this.speed = parseInt(localStorage.TetrisSpeed);
        this._drawLeftText('black', this.speed, tetrominoSize, 1, tetrominoSize * 13);
        // draw score
        this.score = parseInt(localStorage.TetrisScore);
        this._drawLeftText('black', this.score, tetrominoSize, 1, tetrominoSize * 17);

        localStorage.TetrisUnfinishedGame = true;
    }

    _startGame() {
        Controller.addListener(this.canvas, (direction)=> {
            if (this.staticScreen) {
                // if has saved game data
                if (localStorage.TetrisUnfinishedGame !== undefined) {
                    if (confirm('An unfinished game detected, do you want to continue what you left?')) {
                        this._recoverGameData();
                    } else {
                        this._resetGameData();
                    }
                } else {
                    this._resetGameData();
                }

                this.staticScreen = false;
                // start auto down
                setTimeout(autoDown, 1000 - this.speed);
            } else {
                switch (direction) {
                    case 'left':
                        this.soundMove.replay();
                        if (this.map.canTetrominoMove(this.tetromino, -1, 0)) {
                            this.tetromino.move(-1, 0);
                            this.map.updateTetrominoFixedPosition(this.tetromino);
                        }
                        break;
                    case 'right':
                        this.soundMove.replay();
                        if (this.map.canTetrominoMove(this.tetromino, 1, 0)) {
                            this.tetromino.move(1, 0);
                            this.map.updateTetrominoFixedPosition(this.tetromino);
                        }
                        break;
                    case 'down':
                        this.soundMove.replay();
                        if (this.map.canTetrominoMove(this.tetromino, 0, 1)) {
                            this.tetromino.move(0, 1);
                        }
                        break;
                    case 'up':
                        this.soundTrans.replay();
                        if (this.map.canTetrominoTransform(this.tetromino)) {
                            this.tetromino.setShape(this.tetromino.getNextShape());
                            this.map.updateTetrominoFixedPosition(this.tetromino);
                        }
                        break;
                }
            }

            // draw
            this.map.drawBackground();
            this.map.draw();
            this.map.drawTetrominoFixedPosition(this.tetromino);
            this.tetromino.draw();
        });

        // tetromino auto down
        const autoDown = ()=> {
            if (!this.map.canTetrominoMove(this.tetromino, 0, 1)) {
                // reach bottom
                this.soundLand.replay();
                this.map.setTetrominoToMap(this.tetromino, this.soundGlint, ()=> {
                    // calc & update score
                    this.score += this.map.getScore();
                    this._drawLeftText('black', this.score, this.gameConfig.tetrominoSize, 1, this.gameConfig.tetrominoSize * 17);
                    // create a new tetromino
                    this.tetromino = this.nextTetromino;
                    this.nextTetromino = new Tetromino(this.gameConfig, this.ctx);
                    this.count++;
                    // draw next tetromino
                    this._drawNextTetromino();
                    // calc & update speed
                    if (this.count % 30 === 0 && this.speed < 850) {
                        this.speed += 50;
                        this._drawLeftText('black', this.speed, this.gameConfig.tetrominoSize, 1, this.gameConfig.tetrominoSize * 13);
                    }

                    // save data
                    this._saveData();

                    // next turn
                    if (this.map.canTetrominoMove(this.tetromino, 0, 1)) {
                        autoDown();
                    } else {
                        this._gameEnd(true);
                    }
                });
            } else {
                // down one block
                this.tetromino.move(0, 1);
                // next turn
                setTimeout(autoDown, 1000 - this.speed);
            }

            // draw
            if (!this.staticScreen) {
                this.map.drawBackground();
                this.map.draw();
                this.map.drawTetrominoFixedPosition(this.tetromino);
                this.tetromino.draw();
            }
        };
    }

    _saveData() {
        localStorage.TetrisCount = this.count;
        localStorage.TetrisSpeed = this.speed;
        localStorage.TetrisScore = this.score;
        this.map.save('TetrisMap');
        this.tetromino.save('TetrisTetromino');
        this.nextTetromino.save('TetrisNextTetromino');
    }

    _drawNextTetromino() {
        const ctx = this.ctx;
        const config = this.gameConfig;
        const size = config.tetrominoSize;

        // clean area
        ctx.clearRect(config.columns * size + config.gap, size * 4, size * 4, size * 4);

        // draw next tetromino
        this.nextTetromino.draw(config.columns + config.gap / size + 2, 5 + 1);

        // draw current tetromino fixed position
        this.map.updateTetrominoFixedPosition(this.tetromino);
    }

    _gameEnd(isOver) {
        if (isOver) {
            localStorage.removeItem('TetrisUnfinishedGame');
        }

        this.staticScreen = true;

        const ctx = this.ctx;
        const config = this.gameConfig;
        const size = config.tetrominoSize;

        const drawMapCenterText = (text, color, strokeColor, fontSize, yPercent)=> {
            ctx.fillStyle = color;
            ctx.strokeStyle = strokeColor;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textBaseline = 'top';
            const ms = ctx.measureText(text);
            ctx.fillText(text, (config.mapWidth - ms.width) / 2, config.mapHeight * yPercent);
            ctx.strokeText(text, (config.mapWidth - ms.width) / 2, config.mapHeight * yPercent);
        };

        // draw mask
        ctx.fillStyle = 'rgba(115, 115, 115, .8)';
        ctx.fillRect(0, 0, config.mapWidth, config.mapHeight);

        // draw title
        const title = isOver ? 'Game Over' : 'Welcome';
        drawMapCenterText(title, 'green', 'white', size * 1.4, .35);
        // draw tips
        const status = isOver ? 'restart' : 'start';
        drawMapCenterText('press any key to ' + status, 'white', 'transparent', size * .6, .5);
    }

    _drawLeftText(color, text, size, offsetX, y) {
        const ctx = this.ctx;
        const config = this.gameConfig;

        ctx.fillStyle = color;
        ctx.font = `bold ${size}px Arial`;
        ctx.textBaseline = 'top';
        // swipe original text
        ctx.clearRect(config.mapWidth + config.gap + offsetX * config.tetrominoSize, y, config.tetrominoSize * text.toString().length, config.tetrominoSize);
        // draw new text
        ctx.fillText(text, config.mapWidth + config.gap + offsetX * config.tetrominoSize, y);
    };

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