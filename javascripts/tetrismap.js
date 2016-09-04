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
        function TetrisMap(tetrominoSize, ctx) {
            _classCallCheck(this, TetrisMap);

            this.tetrominoSize = tetrominoSize;
            this.ctx = ctx;

            // init map
            this.map = [];
            for (var i = 0; i < 20; i++) {
                var row = [];
                for (var j = 0; j < 10; j++) {
                    row.push('');
                }
                this.map.push(row);
            }
        }

        _createClass(TetrisMap, [{
            key: '_drawBackground',
            value: function _drawBackground() {
                var ctx = this.ctx;
                var size = this.tetrominoSize;

                // draw a gradient background color
                var lineGradient = this.ctx.createLinearGradient(0, 0, size * 10, size * 20);
                lineGradient.addColorStop(0, '#040a1b');
                lineGradient.addColorStop(1, '#082877');
                ctx.fillStyle = lineGradient;
                ctx.fillRect(0, 0, size * 10, size * 20);

                // draw a white grid
                ctx.strokeStyle = 'white';
                for (var i = 0; i < 10; i++) {
                    for (var j = 0; j < 20; j++) {
                        ctx.strokeRect(size * i, size * j, size, size);
                    }
                }
            }
        }]);

        return TetrisMap;
    }();

    exports.default = TetrisMap;
});

//# sourceMappingURL=tetrismap.js.map