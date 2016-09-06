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
                var _this = this;

                var tetrominoSize = this.gameConfig.tetrominoSize;
                var ctx = this.ctx;

                this.map = new _tetrismap2.default(this.gameConfig, ctx);

                this.map.drawBackground();
                this.map.draw();

                var drawLeftText = function drawLeftText(color, text, size, y) {
                    ctx.fillStyle = color;
                    ctx.font = 'bold ' + size + 'px Arial';
                    ctx.textBaseline = 'top';
                    // const mt = ctx.measureText(text);
                    ctx.fillText(text, _this.gameConfig.mapWidth + _this.gameConfig.gap, y);
                };

                drawLeftText('black', 'NEXT', tetrominoSize, tetrominoSize * 2);
                drawLeftText('black', 'SPEED', tetrominoSize, tetrominoSize * 11);
                drawLeftText('black', 'SCORE', tetrominoSize, tetrominoSize * 15);

                // get a random tetromino
                this.tetromino = new _tetromino2.default(this.gameConfig, this.ctx);
                this.nextTetromino = new _tetromino2.default(this.gameConfig, this.ctx);

                // draw next tetromino
                this._drawNextTetromino();
            }
        }, {
            key: '_startGame',
            value: function _startGame() {
                var _this2 = this;

                _controller2.default.addListener(this.canvas, function (direction) {
                    switch (direction) {
                        case 'left':
                            if (_this2.map.canTetrominoMove(_this2.tetromino, -1, 0)) {
                                _this2.tetromino.move(-1, 0);
                            }
                            break;
                        case 'right':
                            if (_this2.map.canTetrominoMove(_this2.tetromino, 1, 0)) {
                                _this2.tetromino.move(1, 0);
                            }
                            break;
                        case 'down':
                            if (_this2.map.canTetrominoMove(_this2.tetromino, 0, 3)) {
                                // can down 3 blocks
                                _this2.tetromino.move(0, 3);
                            } else {
                                // less than 3 blocks reach bottom
                                while (_this2.map.canTetrominoMove(_this2.tetromino, 0, 1)) {
                                    _this2.tetromino.move(0, 1);
                                }
                            }
                            break;
                        case 'up':
                            if (_this2.map.canTetrominoTransform(_this2.tetromino)) {
                                _this2.tetromino.setShape(_this2.tetromino.getNextShape());
                            }
                            break;
                    }

                    // draw
                    _this2.map.drawBackground();
                    _this2.map.draw();
                    _this2.tetromino.draw();
                });

                // tetromino auto down
                setInterval(function () {
                    if (!_this2.map.canTetrominoMove(_this2.tetromino, 0, 1)) {
                        // reach bottom
                        _this2.map.setTetrominoToMap(_this2.tetromino, function () {
                            // create a new tetromino
                            _this2.tetromino = _this2.nextTetromino;
                            _this2.nextTetromino = new _tetromino2.default(_this2.gameConfig, _this2.ctx);
                            // draw next tetromino
                            _this2._drawNextTetromino();
                        });
                    } else {
                        // down one block
                        _this2.tetromino.move(0, 1);
                    }

                    // draw
                    _this2.map.drawBackground();
                    _this2.map.draw();
                    _this2.tetromino.draw();
                }, 1000);
            }
        }, {
            key: '_drawNextTetromino',
            value: function _drawNextTetromino() {
                var ctx = this.ctx;
                var config = this.gameConfig;
                var size = config.tetrominoSize;

                // clean area
                ctx.clearRect(config.columns * size + config.gap, size * 5, size * 4, size * 4);

                // draw next tetromino
                this.nextTetromino.draw(config.columns + config.gap / size + 2, 5 + 2);
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