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

    var Sound = function () {
        function Sound(file) {
            _classCallCheck(this, Sound);

            this.audio = new Audio(file);
        }

        _createClass(Sound, [{
            key: "loadForSafari",
            value: function loadForSafari() {
                var _this = this;

                this.audio.play();
                setTimeout(function () {
                    _this.audio.pause();
                }, 1);
            }
        }, {
            key: "replay",
            value: function replay() {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.audio.play();
            }
        }]);

        return Sound;
    }();

    exports.default = Sound;
});

//# sourceMappingURL=sound.js.map