export default class Controller {

    static _touchEvent(target, callback, bind) {
        if (this.touchStart === undefined) {
            this.touchStart = (event)=> {
                const startPoint = {x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY};

                const touchMove = (event)=> {
                    // prevent window scroll
                    event.preventDefault();
                };

                const touchEnd = (event)=> {
                    const endPoint = event.changedTouches[0];
                    // out of control area
                    if (endPoint.pageX < Controller.controlArea.left || endPoint.pageX > Controller.controlArea.right || endPoint.pageY < Controller.controlArea.top || endPoint.pageY > Controller.controlArea.bottom) {
                        return;
                    }

                    const offsetX = endPoint.pageX - startPoint.x;
                    const offsetY = endPoint.pageY - startPoint.y;

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

    static _keyboardEvent(target, callback, bind) {
        if (this.keyDown === undefined) {
            this.keyDown = (event)=> {
                switch (event.keyCode) {
                    case 87:// w
                    case 73:// i
                        callback('up');
                        break;
                    case 65:// a
                    case 74:// j
                        callback('left');
                        break;
                    case 83:// s
                    case 75:// k
                        callback('down');
                        break;
                    case 68:// d
                    case 76:// l
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

    static removeContextMenu(target) {
        target.addEventListener('contextmenu', (event)=> {
            event.preventDefault();
        });
    }

    static addListener(target, callback) {
        if (window.hasOwnProperty("ontouchstart")) {
            this._touchEvent(target, callback, true);
        } else {
            this._keyboardEvent(target, callback, true);
        }
    }

    static removeListener(target) {
        if (window.hasOwnProperty("ontouchstart")) {
            this._touchEvent(target, null, false);
        } else {
            this._keyboardEvent(target, null, false);
        }
    }
}

Controller.controlArea = null;