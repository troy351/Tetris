define(['exports'], function (exports) {
    'use strict';

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

    var Controller = function () {
        function Controller() {
            _classCallCheck(this, Controller);
        }

        _createClass(Controller, null, [{
            key: '_touchEvent',
            value: function _touchEvent(target, callback, bind) {
                if (this.touchStart === undefined) {
                    this.touchStart = function (event) {
                        var startPoint = { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };

                        var touchMove = function touchMove(event) {
                            // prevent window scroll
                            event.preventDefault();
                        };

                        var touchEnd = function touchEnd(event) {
                            var endPoint = event.changedTouches[0];
                            // out of control area
                            if (endPoint.pageX < Controller.controlArea.left || endPoint.pageX > Controller.controlArea.right || endPoint.pageY < Controller.controlArea.top || endPoint.pageY > Controller.controlArea.bottom) {
                                return;
                            }

                            var offsetX = endPoint.pageX - startPoint.x;
                            var offsetY = endPoint.pageY - startPoint.y;

                            if (Math.abs(offsetX) > 30 || Math.abs(offsetY) > 30) {
                                if (Math.abs(offsetY) > Math.abs(offsetX)) {
                                    if (offsetY < 0) {
                                        callback('up');
                                    } else {
                                        callback('down');
                                    }
                                } else {
                                    if (offsetX > 0) {
                                        callback('right');
                                    } else {
                                        callback('left');
                                    }
                                }
                            }

                            window.removeEventListener('touchmove', touchMove);
                            window.removeEventListener('touchend', touchEnd);
                        };

                        window.addEventListener('touchmove', touchMove);
                        window.addEventListener('touchend', touchEnd);
                    };
                }

                if (bind) {
                    target.addEventListener('touchstart', this.touchStart);
                } else {
                    target.removeEventListener('touchstart', this.touchStart);
                }
            }
        }, {
            key: '_keyboardEvent',
            value: function _keyboardEvent(target, callback, bind) {
                if (this.keyDown === undefined) {
                    this.keyDown = function (event) {
                        switch (event.keyCode) {
                            case 87: // w
                            case 73:
                                // i
                                callback('up');
                                break;
                            case 65: // a
                            case 74:
                                // j
                                callback('left');
                                break;
                            case 83: // s
                            case 75:
                                // k
                                callback('down');
                                break;
                            case 68: // d
                            case 76:
                                // l
                                callback('right');
                                break;
                        }
                    };
                }

                if (bind) {
                    window.addEventListener('keydown', this.keyDown);
                } else {
                    window.removeEventListener('keydown', this.keyDown);
                }
            }
        }, {
            key: 'removeContextMenu',
            value: function removeContextMenu(target) {
                target.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                });
            }
        }, {
            key: 'addListener',
            value: function addListener(target, callback) {
                if (window.hasOwnProperty("ontouchstart")) {
                    this._touchEvent(target, callback, true);
                } else {
                    this._keyboardEvent(target, callback, true);
                }
            }
        }, {
            key: 'removeListener',
            value: function removeListener(target) {
                if (window.hasOwnProperty("ontouchstart")) {
                    this._touchEvent(target, null, false);
                } else {
                    this._keyboardEvent(target, null, false);
                }
            }
        }]);

        return Controller;
    }();

    exports.default = Controller;


    Controller.controlArea = null;
});

//# sourceMappingURL=controller.js.map