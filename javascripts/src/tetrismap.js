import Tetromino from 'javascripts/tetromino';

export default class TetrisMap {
    constructor(tetrominoSize, ctx) {
        this.tetrominoSize = tetrominoSize;
        this.ctx = ctx;

        // init map
        this.map = [];
        for (let i = 0; i < 20; i++) {
            const row = [];
            for (let j = 0; j < 10; j++) {
                row.push('');
            }
            this.map.push(row);
        }
    }

    _drawBackground() {
        const ctx = this.ctx;
        const size = this.tetrominoSize;

        // draw a gradient background color
        const lineGradient = this.ctx.createLinearGradient(0, 0, size * 10, size * 20);
        lineGradient.addColorStop(0, '#040a1b');
        lineGradient.addColorStop(1, '#082877');
        ctx.fillStyle = lineGradient;
        ctx.fillRect(0, 0, size * 10, size * 20);

        // draw a white grid
        ctx.strokeStyle = 'white';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                ctx.strokeRect(size * i, size * j, size, size);
            }
        }
    }
}