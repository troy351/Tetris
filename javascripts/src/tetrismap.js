import Tetromino from 'javascripts/tetromino';

export default class TetrisMap {

    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;

        // init map
        this.map = [];
        for (let i = 0; i < this.config.rows; i++) {
            const row = [];
            for (let j = 0; j < this.config.columns; j++) {
                row.push('');
            }
            this.map.push(row);
        }
    }

    drawBackground() {
        const ctx = this.ctx;
        const size = this.config.tetrominoSize;
        const rows = this.config.rows;
        const columns = this.config.columns;

        // draw a gradient background color
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, size * columns, size * rows);

        // draw a white grid
        ctx.strokeStyle = 'white';
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                ctx.strokeRect(size * i, size * j, size, size);
            }
        }
    }

    draw(fullRows) {
        fullRows = fullRows || [];

        const size = this.config.tetrominoSize;
        const rows = this.config.rows;
        const columns = this.config.columns;

        for (let i = rows - 1; i >= 0; i--) {
            // skip drawing rows that in hide animation
            if (fullRows[i] === true) {
                continue;
            }

            let isRowEmpty = true;
            for (let j = 0; j < columns; j++) {
                if (this.map[i][j] !== '') {
                    isRowEmpty = false;
                    Tetromino.prototype.drawBlock.call(this, this.map[i][j], size * j, size * i);
                }
            }

            // empty row, there won't be any blocks above
            if (isRowEmpty) {
                break;
            }
        }
    }

    canTetrominoTransform(tetromino) {
        if (tetromino === undefined) {
            return false;
        }

        const nextShape = tetromino.getNextShape();
        this.tetrominoPositions = tetromino.getShapePosition(nextShape);

        return this._isTetrominoPositionLegal();
    }

    canTetrominoMove(tetromino, offsetX, offsetY) {
        if (tetromino === undefined) {
            return false;
        }

        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        this.tetrominoPositions = tetromino.getShapePosition(null, offsetX, offsetY);

        return this._isTetrominoPositionLegal();
    }

    setTetrominoToMap(tetromino, sound, callback) {
        if (tetromino === undefined) {
            return false;
        }

        const positions = tetromino.getShapePosition();
        const color = tetromino.getColor();

        for (let i = 0; i < positions.length; i++) {
            const x = positions[i][0];
            const y = positions[i][1];
            this.map[y][x] = color;
        }

        // get full rows
        const fullRows = [];
        let hasFullRows = false;
        for (let i = 0; i < positions.length; i++) {
            // get row number of the one block in current tetromino
            const row = positions[i][1];
            // current row already calculated, skip
            if (fullRows[row] !== undefined) {
                continue;
            }

            let isFull = true;
            for (let j = 0; j < this.config.columns; j++) {
                if (this.map[row][j] === '') {
                    isFull = false;
                }
            }

            hasFullRows = isFull ? true : hasFullRows;
            fullRows[row] = isFull;
        }

        // has full rows
        if (hasFullRows) {
            sound.replay();
            this._shiningBlocks(fullRows, 3, 200, callback);
        } else {
            this.score = 0;
            callback();
        }
    }

    updateTetrominoFixedPosition(tetromino) {
        let y = 0;
        while (this.canTetrominoMove(tetromino, 0, y + 1)) {
            y++;
        }

        this.outlinePositions = tetromino.getShapePosition(null, 0, y);
    }

    drawTetrominoFixedPosition(tetromino) {
        tetromino.drawOutline(this.outlinePositions);
    }

    getScore() {
        return this.score;
    }

    save(key) {
        key = key || 'TetrisMap';
        localStorage[key] = JSON.stringify(this.map);
    }

    load(key) {
        key = key || 'TetrisMap';
        this.map = localStorage[key] = JSON.parse(localStorage[key]);
    }

    _shiningBlocks(fullRows, times, duration, callback) {
        times = times || 3;
        let curTimes = 0;
        // for each show and hide, double times and half duration
        times *= 2;
        duration /= 2;

        const shining = setInterval(()=> {
            curTimes++;

            this.drawBackground();

            if (curTimes % 2 === 0) {
                // hide full rows
                this.draw(fullRows);
            } else {
                // show full rows
                this.draw();
            }

            // animation complete
            if (curTimes >= times) {
                clearInterval(shining);
                this._deleteFullRows(fullRows);
                callback();
            }
        }, duration);
    }

    _deleteFullRows(fullRows) {
        // delete `false` key in fullRows and sort it.
        const fr = [];
        for (let key in fullRows) {
            if (fullRows[key] === true) {
                fr.push(parseInt(key));
            }
        }
        fr.sort((a, b)=> {
            return b - a;
        });

        // calc score
        this.score = 100 * (fr.length * 2 - 1);

        // the row number will be affected by the under row wiping.
        for (let i = 0; i < fr.length; i++) {
            fr[i] += i;
        }

        // replace full rows with above rows, and empty above rows.
        for (let k = 0; k < fr.length; k++) {
            for (let i = fr[k] - 1; i >= 0; i--) {
                for (let j = 0; j < this.config.columns; j++) {
                    this.map[i + 1][j] = this.map[i][j];
                    this.map[i][j] = '';
                }
            }
        }
    }

    _isTetrominoPositionLegal() {
        const positions = this.tetrominoPositions;

        for (let i = 0; i < positions.length; i++) {
            const x = positions[i][0];
            const y = positions[i][1];
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
}