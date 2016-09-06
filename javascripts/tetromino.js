define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var Tetromino = function () {
        function Tetromino(config, ctx) {
            _classCallCheck(this, Tetromino);

            this.config = config;
            this.ctx = ctx;

            // create a random shape based on modules
            var modules = Tetromino.modules;
            this.type = Math.floor(Math.random() * modules.length);
            this.shape = Math.floor(Math.random() * modules[this.type].shape.length);

            // set initial coordinates
            this.mapX = Math.floor(config.columns / 2);
            this.mapY = -1;
            if (this.type == 0 || this.type == 1 && this.shape == 1 || this.type == 4 && this.shape == 1 || this.type == 5 && this.shape == 3 || this.type == 6 && this.shape == 0) {
                // no blocks below the core block
                this.mapY = 0;
            }
        }

        _createClass(Tetromino, [{
            key: "getNextShape",
            value: function getNextShape() {
                return (this.shape + 1) % Tetromino.modules[this.type].shape.length;
            }
        }, {
            key: "setShape",
            value: function setShape(shape) {
                shape = shape || 0;

                this.shape = shape;
            }
        }, {
            key: "draw",
            value: function draw(x, y) {
                x = x || this.mapX;
                y = y || this.mapY;

                var s = Tetromino.modules[this.type].shape[this.shape];
                var size = this.config.tetrominoSize;
                var color = this.getColor();
                for (var i = 0; i < s.length; i++) {
                    var blockY = y + s[i][1];
                    if (blockY >= 0) {
                        // in map area
                        this.drawBlock(color, (x + s[i][0]) * size, blockY * size);
                    }
                }
            }
        }, {
            key: "getShapePosition",
            value: function getShapePosition(shape, offsetX, offsetY) {
                if (shape === null || shape === undefined) {
                    shape = this.shape;
                }

                offsetX = offsetX || 0;
                offsetY = offsetY || 0;

                var positions = [];
                var s = Tetromino.modules[this.type].shape[shape];

                for (var i = 0; i < s.length; i++) {
                    var x = this.mapX + s[i][0] + offsetX;
                    var y = this.mapY + s[i][1] + offsetY;
                    y = y < 0 ? 0 : y;

                    positions.push([x, y]);
                }

                return positions;
            }
        }, {
            key: "move",
            value: function move(offsetX, offsetY) {
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;

                this.mapX += offsetX;
                this.mapY += offsetY;
            }
        }, {
            key: "getColor",
            value: function getColor() {
                return Tetromino.modules[this.type].color;
            }
        }, {
            key: "drawBlock",
            value: function drawBlock(color, x, y) {
                var ctx = this.ctx;
                var size = this.config.tetrominoSize;
                var centerSize = Math.round(size * 0.6);
                var gap = Math.ceil((size - centerSize) / 2);
                var colorLuminance = Tetromino.colorLuminance;

                // border top
                ctx.beginPath();
                ctx.fillStyle = colorLuminance(color, .6);
                ctx.moveTo(x, y);
                ctx.lineTo(x + gap, y + gap);
                ctx.lineTo(x + size - gap, y + gap);
                ctx.lineTo(x + size, y);
                ctx.closePath();
                ctx.fill();

                // border top left gap
                ctx.beginPath();
                ctx.strokeStyle = colorLuminance(color, .6);
                ctx.moveTo(x, y);
                ctx.lineTo(x + gap, y + gap);
                ctx.closePath();
                ctx.stroke();

                // border top right gap
                ctx.beginPath();
                ctx.strokeStyle = colorLuminance(color, .6);
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + size - gap, y + gap);
                ctx.closePath();
                ctx.stroke();

                // border left
                ctx.beginPath();
                ctx.fillStyle = colorLuminance(color, .4);
                ctx.moveTo(x, y);
                ctx.lineTo(x + gap, y + gap);
                ctx.lineTo(x + gap, y + size - gap);
                ctx.lineTo(x, y + size);
                ctx.closePath();
                ctx.fill();

                // border right
                ctx.beginPath();
                ctx.fillStyle = colorLuminance(color, -.2);
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + size - gap, y + gap);
                ctx.lineTo(x + size - gap, y + size - gap);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.fill();

                // border bottom
                ctx.beginPath();
                ctx.fillStyle = colorLuminance(color, -.4);
                ctx.moveTo(x, y + size);
                ctx.lineTo(x + gap, y + size - gap);
                ctx.lineTo(x + size - gap, y + size - gap);
                ctx.lineTo(x + size, y + size);
                ctx.closePath();
                ctx.fill();

                // border bottom left gap
                ctx.beginPath();
                ctx.strokeStyle = colorLuminance(color, -.4);
                ctx.moveTo(x, y + size);
                ctx.lineTo(x + gap, y + size - gap);
                ctx.closePath();
                ctx.stroke();

                // border bottom right gap
                ctx.beginPath();
                ctx.strokeStyle = colorLuminance(color, -.4);
                ctx.moveTo(x + size, y + size);
                ctx.lineTo(x + size - gap, y + size - gap);
                ctx.closePath();
                ctx.stroke();

                // center rect
                ctx.fillStyle = color;
                ctx.fillRect(x + gap, y + gap, centerSize, centerSize);
            }
        }], [{
            key: "colorLuminance",
            value: function colorLuminance(hex, lum) {
                // validate hex string
                hex = String(hex).replace(/[^0-9a-f]/gi, '');
                if (hex.length < 6) {
                    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
                }
                lum = lum || 0;

                // convert to decimal and change luminosity
                var rgb = "#",
                    c,
                    i;
                for (i = 0; i < 3; i++) {
                    c = parseInt(hex.substr(i * 2, 2), 16);
                    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
                    rgb += ("00" + c).substr(c.length);
                }

                return rgb;
            }
        }]);

        return Tetromino;
    }();

    exports.default = Tetromino;


    // see all modules design in README.md
    Tetromino.modules = [];

    var O = {};
    O.shape = [];
    O.shape.push([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
    O.color = '#ff0'; // yellow
    Tetromino.modules.push(O);

    var I = {};
    I.shape = [];
    I.shape.push([[0, -2], [0, -1], [0, 0], [0, 1]]);
    I.shape.push([[-2, 0], [-1, 0], [0, 0], [1, 0]]);
    I.color = '#0ff'; // cyan
    Tetromino.modules.push(I);

    var S = {};
    S.shape = [];
    S.shape.push([[-1, -1], [-1, 0], [0, 0], [0, 1]]);
    S.shape.push([[0, -1], [1, -1], [-1, 0], [0, 0]]);
    S.color = '#80ff00'; // lime
    Tetromino.modules.push(S);

    var Z = {};
    Z.shape = [];
    Z.shape.push([[0, -1], [-1, 0], [0, 0], [-1, 1]]);
    Z.shape.push([[-1, -1], [0, -1], [0, 0], [1, 0]]);
    Z.color = '#f00'; // red
    Tetromino.modules.push(Z);

    var L = {};
    L.shape = [];
    L.shape.push([[-1, -1], [0, -1], [0, 0], [0, 1]]);
    L.shape.push([[1, -1], [-1, 0], [0, 0], [1, 0]]);
    L.shape.push([[0, -1], [0, 0], [0, 1], [1, 1]]);
    L.shape.push([[-1, 0], [0, 0], [1, 0], [-1, 1]]);
    L.color = '#ffa500'; // orange
    Tetromino.modules.push(L);

    var J = {};
    J.shape = [];
    J.shape.push([[0, -1], [1, -1], [0, 0], [0, 1]]);
    J.shape.push([[-1, 0], [0, 0], [1, 0], [1, 1]]);
    J.shape.push([[0, -1], [0, 0], [-1, 1], [0, 1]]);
    J.shape.push([[-1, -1], [-1, 0], [0, 0], [1, 0]]);
    J.color = '#00f'; // blue
    Tetromino.modules.push(J);

    var T = {};
    T.shape = [];
    T.shape.push([[0, -1], [-1, 0], [0, 0], [1, 0]]);
    T.shape.push([[0, -1], [0, 0], [1, 0], [0, 1]]);
    T.shape.push([[-1, 0], [0, 0], [1, 0], [0, 1]]);
    T.shape.push([[0, -1], [-1, 0], [0, 0], [0, 1]]);
    T.color = '#800080'; // purple
    Tetromino.modules.push(T);
});

//# sourceMappingURL=tetromino.js.map