define(['exports', 'javascripts/tetromino', 'javascripts/tetrismap', 'javascripts/controller', 'javascripts/sound'], function (exports, _tetromino, _tetrismap, _controller, _sound) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tetromino2 = _interopRequireDefault(_tetromino);

    var _tetrismap2 = _interopRequireDefault(_tetrismap);

    var _controller2 = _interopRequireDefault(_controller);

    var _sound2 = _interopRequireDefault(_sound);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Tetris = function () {
        function Tetris(options) {
            _classCallCheck(this, Tetris);

            this.options = options;

            this._initInterface();
            this._startGame();
        }

        _createClass(Tetris, [{
            key: '_initInterface',
            value: function _initInterface() {
                var gameArea = document.getElementById(this.options.gameArea);

                this.canvas = document.createElement('canvas');
                this.canvas.innerText = 'Your browser doesn\'t support html5 canvas, please upgrade your browser.';
                gameArea.appendChild(this.canvas);
                this.ctx = this.canvas.getContext('2d');

                this.gameConfig = {};
                this.gameConfig.rows = 20;
                this.gameConfig.columns = 10;
                var tetrominoSize = 0;
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
                _controller2.default.controlArea = {
                    top: 197,
                    left: (window.innerWidth - this.canvas.width / 2) / 2,
                    right: (window.innerWidth + this.canvas.width / 2) / 2,
                    bottom: 197 + this.canvas.height / 2
                };

                // first start screen
                this._gameEnd(false);

                // load sound
                this.soundGlint = new _sound2.default('sounds/glint.wav');
                this.soundLand = new _sound2.default('sounds/land.wav');
                this.soundMove = new _sound2.default('sounds/move.wav');
                this.soundTrans = new _sound2.default('sounds/trans.wav');

                // safari won't auto load sound unless user clicked
                // there is a trick that play sound 1ms while user touches canvas first time
                if (navigator.userAgent.match(/(iPad|iPhone)/)) {
                    this.canvas.setAttribute('ontouchstart', '\n            window.soundMove.loadForSafari();\n            window.soundGlint.loadForSafari();\n            window.soundLand.loadForSafari();\n            window.soundTrans.loadForSafari();\n            delete window.soundMove;\n            delete window.soundGlint;\n            delete window.soundLand;\n            delete window.soundTrans;\n            this.removeAttribute("ontouchstart");'.replace(/            /g, '').split('\n').join(''));

                    window.soundMove = this.soundMove;
                    window.soundGlint = this.soundGlint;
                    window.soundLand = this.soundLand;
                    window.soundTrans = this.soundTrans;
                }
            }
        }, {
            key: '_resetGameData',
            value: function _resetGameData() {
                var tetrominoSize = this.gameConfig.tetrominoSize;
                var ctx = this.ctx;
                // clear canvas
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.map = new _tetrismap2.default(this.gameConfig, ctx);
                this.map.drawBackground();
                this.map.draw();

                this._drawLeftText('black', 'NEXT', tetrominoSize, 0, tetrominoSize * 2);
                this._drawLeftText('black', 'SPEED', tetrominoSize, 0, tetrominoSize * 11);
                this._drawLeftText('black', 'SCORE', tetrominoSize, 0, tetrominoSize * 15);

                // get a random tetromino
                this.tetromino = new _tetromino2.default(this.gameConfig, this.ctx);
                this.nextTetromino = new _tetromino2.default(this.gameConfig, this.ctx);

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
        }, {
            key: '_recoverGameData',
            value: function _recoverGameData() {
                var tetrominoSize = this.gameConfig.tetrominoSize;
                var ctx = this.ctx;
                // clear canvas
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.map = new _tetrismap2.default(this.gameConfig, ctx);
                this.map.load('TetrisMap');
                this.map.drawBackground();
                this.map.draw();

                this._drawLeftText('black', 'NEXT', tetrominoSize, 0, tetrominoSize * 2);
                this._drawLeftText('black', 'SPEED', tetrominoSize, 0, tetrominoSize * 11);
                this._drawLeftText('black', 'SCORE', tetrominoSize, 0, tetrominoSize * 15);

                // get a random tetromino
                this.tetromino = new _tetromino2.default(this.gameConfig, this.ctx);
                this.tetromino.load('TetrisTetromino');
                this.nextTetromino = new _tetromino2.default(this.gameConfig, this.ctx);
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
        }, {
            key: '_startGame',
            value: function _startGame() {
                var _this = this;

                _controller2.default.addListener(this.canvas, function (direction) {
                    if (_this.staticScreen) {
                        // if has saved game data
                        if (localStorage.TetrisUnfinishedGame !== undefined) {
                            if (confirm('An unfinished game detected, do you want to continue what you left?')) {
                                _this._recoverGameData();
                            } else {
                                _this._resetGameData();
                            }
                        } else {
                            _this._resetGameData();
                        }

                        _this._saveData();
                        _this.staticScreen = false;
                        // start auto down
                        setTimeout(autoDown, 900 - _this.speed);
                    } else {
                        switch (direction) {
                            case 'left':
                                _this.soundMove.replay();
                                if (_this.map.canTetrominoMove(_this.tetromino, -1, 0)) {
                                    _this.tetromino.move(-1, 0);
                                    _this.map.updateTetrominoFixedPosition(_this.tetromino);
                                }
                                break;
                            case 'right':
                                _this.soundMove.replay();
                                if (_this.map.canTetrominoMove(_this.tetromino, 1, 0)) {
                                    _this.tetromino.move(1, 0);
                                    _this.map.updateTetrominoFixedPosition(_this.tetromino);
                                }
                                break;
                            case 'down':
                                _this.soundMove.replay();
                                if (_this.map.canTetrominoMove(_this.tetromino, 0, 1)) {
                                    _this.tetromino.move(0, 1);
                                }
                                break;
                            case 'up':
                                _this.soundTrans.replay();
                                if (_this.map.canTetrominoTransform(_this.tetromino)) {
                                    _this.tetromino.setShape(_this.tetromino.getNextShape());
                                    _this.map.updateTetrominoFixedPosition(_this.tetromino);
                                }
                                break;
                        }
                    }

                    // draw
                    _this.map.drawBackground();
                    _this.map.draw();
                    _this.map.drawTetrominoFixedPosition(_this.tetromino);
                    _this.tetromino.draw();
                });

                // tetromino auto down
                var autoDown = function autoDown() {
                    if (!_this.map.canTetrominoMove(_this.tetromino, 0, 1)) {
                        // reach bottom
                        _this.map.setTetrominoToMap(_this.tetromino, _this.soundLand, _this.soundGlint, function () {
                            // calc & update score
                            _this.score += _this.map.getScore();
                            _this._drawLeftText('black', _this.score, _this.gameConfig.tetrominoSize, 1, _this.gameConfig.tetrominoSize * 17);
                            // create a new tetromino
                            _this.tetromino = _this.nextTetromino;
                            _this.nextTetromino = new _tetromino2.default(_this.gameConfig, _this.ctx);
                            _this.count++;
                            // draw next tetromino
                            _this._drawNextTetromino();
                            // calc & update speed
                            if (_this.count % 20 === 0 && _this.speed < 750) {
                                _this.speed += 50;
                                _this._drawLeftText('black', _this.speed, _this.gameConfig.tetrominoSize, 1, _this.gameConfig.tetrominoSize * 13);
                            }

                            // save data
                            _this._saveData();

                            // next turn
                            if (_this.map.canTetrominoMove(_this.tetromino, 0, 1)) {
                                autoDown();
                            } else {
                                _this._gameEnd(true);
                            }
                        });
                    } else {
                        // down one block
                        _this.tetromino.move(0, 1);
                        // next turn
                        setTimeout(autoDown, 900 - _this.speed);
                    }

                    // draw
                    if (!_this.staticScreen) {
                        _this.map.drawBackground();
                        _this.map.draw();
                        _this.map.drawTetrominoFixedPosition(_this.tetromino);
                        _this.tetromino.draw();
                    }
                };
            }
        }, {
            key: '_saveData',
            value: function _saveData() {
                localStorage.TetrisCount = this.count;
                localStorage.TetrisSpeed = this.speed;
                localStorage.TetrisScore = this.score;
                this.map.save('TetrisMap');
                this.tetromino.save('TetrisTetromino');
                this.nextTetromino.save('TetrisNextTetromino');
            }
        }, {
            key: '_drawNextTetromino',
            value: function _drawNextTetromino() {
                var ctx = this.ctx;
                var config = this.gameConfig;
                var size = config.tetrominoSize;

                // clean area
                ctx.clearRect(config.columns * size + config.gap, size * 4, size * 4, size * 4);

                // draw next tetromino
                this.nextTetromino.draw(config.columns + config.gap / size + 2, 5 + 1);

                // draw current tetromino fixed position
                this.map.updateTetrominoFixedPosition(this.tetromino);
            }
        }, {
            key: '_gameEnd',
            value: function _gameEnd(isOver) {
                if (isOver) {
                    localStorage.removeItem('TetrisUnfinishedGame');
                }

                this.staticScreen = true;

                var ctx = this.ctx;
                var config = this.gameConfig;
                var size = config.tetrominoSize;

                var drawMapCenterText = function drawMapCenterText(text, color, strokeColor, fontSize, yPercent) {
                    ctx.fillStyle = color;
                    ctx.strokeStyle = strokeColor;
                    ctx.font = 'bold ' + fontSize + 'px Arial';
                    ctx.textBaseline = 'top';
                    var ms = ctx.measureText(text);
                    ctx.fillText(text, (config.mapWidth - ms.width) / 2, config.mapHeight * yPercent);
                    ctx.strokeText(text, (config.mapWidth - ms.width) / 2, config.mapHeight * yPercent);
                };

                // draw mask
                ctx.fillStyle = 'rgba(115, 115, 115, .8)';
                ctx.fillRect(0, 0, config.mapWidth, config.mapHeight);

                // draw title
                var title = isOver ? 'Game Over' : 'Welcome';
                drawMapCenterText(title, 'green', 'white', size * 1.4, .35);
                // draw tips
                var status = isOver ? 'restart' : 'start';
                drawMapCenterText('press any key to ' + status, 'white', 'transparent', size * .6, .5);
            }
        }, {
            key: '_drawLeftText',
            value: function _drawLeftText(color, text, size, offsetX, y) {
                var ctx = this.ctx;
                var config = this.gameConfig;

                ctx.fillStyle = color;
                ctx.font = 'bold ' + size + 'px Arial';
                ctx.textBaseline = 'top';
                // swipe original text
                ctx.clearRect(config.mapWidth + config.gap + offsetX * config.tetrominoSize, y, config.tetrominoSize * text.toString().length, config.tetrominoSize);
                // draw new text
                ctx.fillText(text, config.mapWidth + config.gap + offsetX * config.tetrominoSize, y);
            }
        }, {
            key: 'options',
            set: function set(_options) {
                var options = {
                    gameArea: ''
                };

                for (var key in options) {
                    if (_options[key] !== undefined) {
                        options[key] = _options[key];
                    }
                }

                this._options = options;
            },
            get: function get() {
                return this._options;
            }
        }]);

        return Tetris;
    }();

    exports.default = Tetris;
});

//# sourceMappingURL=tetris.js.map