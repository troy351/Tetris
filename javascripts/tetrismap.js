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
                var lineGradient = ctx.createLinearGradient(0, 0, size * columns, size * rows);
                lineGradient.addColorStop(0, '#082877');
                lineGradient.addColorStop(1, '#040a1b');
                ctx.fillStyle = lineGradient;
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
                var size = this.config.tetrominoSize;
                var rows = this.config.rows;
                var columns = this.config.columns;

                for (var i = rows - 1; i >= 0; i--) {
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
            value: function canTetrominoMove(tetromino, offsetX, offsetY) {
                if (tetromino === undefined) {
                    return false;
                }

                offsetX = offsetX || 0;
                offsetY = offsetY || 0;

                this.tetrominoPositions = tetromino.getShapePosition(null, offsetX, offsetY);

                return this._isTetrominoPositionLegal();
            }
        }, {
            key: 'reachBottom',
            value: function reachBottom(tetromino) {
                if (tetromino === undefined) {
                    return false;
                }

                var positions = tetromino.getShapePosition();

                for (var i = 0; i < positions.length; i++) {
                    var x = positions[i][0];
                    var y = positions[i][1];
                    if (y + 1 === this.config.rows || this.map[y + 1][x] !== '') {
                        // reach bottom || there is a color block below
                        return true;
                    }
                }

                return false;
            }
        }, {
            key: 'setTetrominoToMap',
            value: function setTetrominoToMap(tetromino) {
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