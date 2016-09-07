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
            this._initGame();
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
        }, {
            key: '_initGame',
            value: function _initGame() {
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

                this.gameover = false;
            }
        }, {
            key: '_startGame',
            value: function _startGame() {
                var _this = this;

                _controller2.default.addListener(this.canvas, function (direction) {
                    if (_this.gameover) {
                        // reset game data
                        _this._initGame();
                        // restart auto down
                        setTimeout(autoDown, 1000 - _this.speed);
                    } else {
                        switch (direction) {
                            case 'left':
                                if (_this.map.canTetrominoMove(_this.tetromino, -1, 0)) {
                                    _this.tetromino.move(-1, 0);
                                    _this.map.updateTetrominoFixedPosition(_this.tetromino);
                                }
                                break;
                            case 'right':
                                if (_this.map.canTetrominoMove(_this.tetromino, 1, 0)) {
                                    _this.tetromino.move(1, 0);
                                    _this.map.updateTetrominoFixedPosition(_this.tetromino);
                                }
                                break;
                            case 'down':
                                if (_this.map.canTetrominoMove(_this.tetromino, 0, 1)) {
                                    _this.tetromino.move(0, 1);
                                }
                                break;
                            case 'up':
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
                        _this.map.setTetrominoToMap(_this.tetromino, function () {
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
                            if (_this.count % 30 === 0 && _this.speed < 850) {
                                _this.speed += 50;
                                _this._drawLeftText('black', _this.speed, _this.gameConfig.tetrominoSize, 1, _this.gameConfig.tetrominoSize * 13);
                            }

                            // next turn
                            if (_this.map.canTetrominoMove(_this.tetromino, 0, 1)) {
                                autoDown();
                            } else {
                                _this._gameOver();
                            }
                        });
                    } else {
                        // down one block
                        _this.tetromino.move(0, 1);
                        // next turn
                        setTimeout(autoDown, 1000 - _this.speed);
                    }

                    // draw
                    if (!_this.gameover) {
                        _this.map.drawBackground();
                        _this.map.draw();
                        _this.map.drawTetrominoFixedPosition(_this.tetromino);
                        _this.tetromino.draw();
                    }
                };

                setTimeout(autoDown, 1000 - this.speed);
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
            key: '_gameOver',
            value: function _gameOver() {
                this.gameover = true;
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

                // draw `Game Over`
                drawMapCenterText('Game Over', 'green', 'white', size * 1.4, .35);
                // draw `press any key to restart`
                drawMapCenterText('press any key to restart', 'white', 'transparent', size * .6, .5);
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