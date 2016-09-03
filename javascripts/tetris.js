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
        }

        _createClass(Tetris, [{
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