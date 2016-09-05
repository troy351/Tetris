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
        const lineGradient = ctx.createLinearGradient(0, 0, size * columns, size * rows);
        lineGradient.addColorStop(0, '#082877');
        lineGradient.addColorStop(1, '#040a1b');
        ctx.fillStyle = lineGradient;
        ctx.fillRect(0, 0, size * columns, size * rows);

        // draw a white grid
        ctx.strokeStyle = 'white';
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                ctx.strokeRect(size * i, size * j, size, size);
            }
        }
    }

    draw() {
        const size = this.config.tetrominoSize;
        const rows = this.config.rows;
        const columns = this.config.columns;

        for (let i = rows - 1; i >= 0; i--) {
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

    reachBottom(tetromino) {
        if (tetromino === undefined) {
            return false;
        }

        const positions = tetromino.getShapePosition();

        for (let i = 0; i < positions.length; i++) {
            const x = positions[i][0];
            const y = positions[i][1];
            if (y + 1 === this.config.rows || this.map[y + 1][x] !== '') {
                // reach bottom || there is a color block below
                return true;
            }
        }

        return false;
    }

    setTetrominoToMap(tetromino) {
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