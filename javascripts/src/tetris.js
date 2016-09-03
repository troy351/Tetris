import Block from 'javascripts/tetromino';
import TetrisMap from 'javascripts/tetrismap';
import Controller from 'javascripts/controller';
import Sound from 'javascripts/sound';

export default class Tetris {
    constructor(options) {
        this.options = options;

    }

    set options(_options) {
        const options = {
            gameArea: ''
        };

        for (let key in options) {
            if (_options[key] !== undefined) {
                options[key] = _options[key];
            }
        }

        this._options = options;
    }

    get options() {
        return this._options;
    }
}