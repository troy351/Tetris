define(['exports', 'javascripts/tetromino'], function (exports, _tetromino) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _tetromino2 = _interopRequireDefault(_tetromino);

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

    var TetrisMap = function () {
        function TetrisMap(config, ctx) {
            _classCallCheck(this, TetrisMap);

            this.config = config;
            this.ctx = ctx;

            // init map
            this.map = [];
            for (var i = 0; i < this.config.rows; i++) {
                var row = [];
                for (var j = 0; j < this.config.columns; j++) {
                    row.push('');
                }
                this.map.push(row);
            }
        }

        _createClass(TetrisMap, [{
            key: 'drawBackground',
            value: function drawBackground() {
                var ctx = this.ctx;
                var size = this.config.tetrominoSize;
                var rows = this.config.rows;
                var columns = this.config.columns;

                // draw a gradient background color
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, size * columns, size * rows);

                // draw a white grid
                ctx.strokeStyle = 'white';
                for (var i = 0; i < columns; i++) {
                    for (var j = 0; j < rows; j++) {
                        ctx.strokeRect(size * i, size * j, size, size);
                    }
                }
            }
        }, {
            key: 'draw',
            value: function draw() {
                var fullRows = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

                var size = this.config.tetrominoSize;
                var rows = this.config.rows;
                var columns = this.config.columns;

                for (var i = rows - 1; i >= 0; i--) {
                    // skip drawing rows that in hide animation
                    if (fullRows[i] === true) {
                        continue;
                    }

                    var isRowEmpty = true;
                    for (var j = 0; j < columns; j++) {
                        if (this.map[i][j] !== '') {
                            isRowEmpty = false;
                            _tetromino2.default.prototype.drawBlock.call(this, this.map[i][j], size * j, size * i);
                        }
                    }

                    // empty row, there won't be any blocks above
                    if (isRowEmpty) {
                        break;
                    }
                }
            }
        }, {
            key: 'canTetrominoTransform',
            value: function canTetrominoTransform(tetromino) {
                if (tetromino === undefined) {
                    return false;
                }

                var nextShape = tetromino.getNextShape();
                this.tetrominoPositions = tetromino.getShapePosition(nextShape);

                return this._isTetrominoPositionLegal();
            }
        }, {
            key: 'canTetrominoMove',
            value: function canTetrominoMove(tetromino) {
                var offsetX = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
                var offsetY = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                if (tetromino === undefined) {
                    return false;
                }

                this.tetrominoPositions = tetromino.getShapePosition(undefined, offsetX, offsetY);

                return this._isTetrominoPositionLegal();
            }
        }, {
            key: 'setTetrominoToMap',
            value: function setTetrominoToMap(tetromino, landSound, glintSound, callback) {
                if (tetromino === undefined) {
                    return false;
                }

                var positions = tetromino.getShapePosition();
                var color = tetromino.getColor();

                for (var i = 0; i < positions.length; i++) {
                    var x = positions[i][0];
                    var y = positions[i][1];
                    this.map[y][x] = color;
                }

                // get full rows
                var fullRows = [];
                var hasFullRows = false;
                for (var _i = 0; _i < positions.length; _i++) {
                    // get row number of the one block in current tetromino
                    var row = positions[_i][1];
                    // current row already calculated, skip
                    if (fullRows[row] !== undefined) {
                        continue;
                    }

                    var isFull = true;
                    for (var j = 0; j < this.config.columns; j++) {
                        if (this.map[row][j] === '') {
                            isFull = false;
                        }
                    }

                    hasFullRows = isFull ? true : hasFullRows;
                    fullRows[row] = isFull;
                }

                // has full rows
                if (hasFullRows) {
                    glintSound.replay();
                    this._shiningBlocks(fullRows, 3, 200, callback);
                } else {
                    landSound.replay();
                    this.score = 0;
                    callback();
                }
            }
        }, {
            key: 'updateTetrominoFixedPosition',
            value: function updateTetrominoFixedPosition(tetromino) {
                var y = 0;
                while (this.canTetrominoMove(tetromino, 0, y + 1)) {
                    y++;
                }

                this.outlinePositions = tetromino.getShapePosition(undefined, 0, y);
            }
        }, {
            key: 'drawTetrominoFixedPosition',
            value: function drawTetrominoFixedPosition(tetromino) {
                tetromino.drawOutline(this.outlinePositions);
            }
        }, {
            key: 'getScore',
            value: function getScore() {
                return this.score;
            }
        }, {
            key: 'save',
            value: function save() {
                var key = arguments.length <= 0 || arguments[0] === undefined ? 'TetrisMap' : arguments[0];

                localStorage[key] = JSON.stringify(this.map);
            }
        }, {
            key: 'load',
            value: function load() {
                var key = arguments.length <= 0 || arguments[0] === undefined ? 'TetrisMap' : arguments[0];

                this.map = localStorage[key] = JSON.parse(localStorage[key]);
            }
        }, {
            key: '_shiningBlocks',
            value: function _shiningBlocks(fullRows) {
                var times = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

                var _this = this;

                var duration = arguments[2];
                var callback = arguments[3];

                var curTimes = 0;
                // for each show and hide, double times and half duration
                times *= 2;
                duration /= 2;

                var shining = setInterval(function () {
                    curTimes++;

                    _this.drawBackground();

                    if (curTimes % 2 === 0) {
                        // hide full rows
                        _this.draw(fullRows);
                    } else {
                        // show full rows
                        _this.draw();
                    }

                    // animation complete
                    if (curTimes >= times) {
                        clearInterval(shining);
                        _this._deleteFullRows(fullRows);
                        callback();
                    }
                }, duration);
            }
        }, {
            key: '_deleteFullRows',
            value: function _deleteFullRows(fullRows) {
                // delete `false` key in fullRows and sort it.
                var fr = [];
                for (var key in fullRows) {
                    if (fullRows[key] === true) {
                        fr.push(parseInt(key));
                    }
                }
                fr.sort(function (a, b) {
                    return b - a;
                });

                // calc score
                this.score = 100 * (fr.length * 2 - 1);

                // the row number will be affected by the under row wiping.
                for (var i = 0; i < fr.length; i++) {
                    fr[i] += i;
                }

                // replace full rows with above rows, and empty above rows.
                for (var k = 0; k < fr.length; k++) {
                    for (var _i2 = fr[k] - 1; _i2 >= 0; _i2--) {
                        for (var j = 0; j < this.config.columns; j++) {
                            this.map[_i2 + 1][j] = this.map[_i2][j];
                            this.map[_i2][j] = '';
                        }
                    }
                }
            }
        }, {
            key: '_isTetrominoPositionLegal',
            value: function _isTetrominoPositionLegal() {
                var positions = this.tetrominoPositions;

                for (var i = 0; i < positions.length; i++) {
                    var x = positions[i][0];
                    var y = positions[i][1];
                    if (x < this.config.columns && x >= 0 && y < this.config.rows && y >= 0) {
                        if (this.map[y][x] !== '') {
                            // already had a block here
                            return false;
                        }
                    } else {
                        // out of map area
                        return false;
                    }
                }

                return true;
            }
        }]);

        return TetrisMap;
    }();

    exports.default = TetrisMap;
});

//# sourceMappingURL=tetrismap.js.map