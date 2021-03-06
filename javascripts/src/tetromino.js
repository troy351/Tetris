export default class Tetromino {

    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;

        // create a random shape based on modules
        const modules = Tetromino.modules;
        this.type = Math.floor(Math.random() * modules.length);
        this.shape = Math.floor(Math.random() * modules[this.type].shape.length);

        this._initCoordinates();
    }

    _initCoordinates() {
        this.mapX = Math.floor(this.config.columns / 2);
        this.mapY = -1;
        if (this.type == 0 || this.type == 1 && this.shape == 1 || this.type == 4 && this.shape == 1 || this.type == 5 && this.shape == 3 || this.type == 6 && this.shape == 0) {
            // no blocks below the core block
            this.mapY = 0;
        }
    }

    getNextShape() {
        return (this.shape + 1) % Tetromino.modules[this.type].shape.length;
    }

    setShape(shape = 0) {
        this.shape = shape;
    }

    draw(x = this.mapX, y = this.mapY) {
        const s = Tetromino.modules[this.type].shape[this.shape];
        const size = this.config.tetrominoSize;
        const color = this.getColor();
        for (let i = 0; i < s.length; i++) {
            const blockY = y + s[i][1];
            if (blockY >= 0) {
                // in map area
                this.drawBlock(color, (x + s[i][0]) * size, blockY * size);
            }
        }
    }

    drawOutline(positions) {
        if (positions === undefined) {
            return;
        }

        const size = this.config.tetrominoSize;
        const color = this.getColor();
        for (let i = 0; i < positions.length; i++) {
            const blockY = positions[i][1];
            if (blockY >= 0) {
                // in map area
                this.drawBlockOutline(color, positions[i][0] * size, blockY * size);
            }
        }
    }

    getShapePosition(shape = this.shape, offsetX = 0, offsetY = 0) {
        const positions = [];
        const s = Tetromino.modules[this.type].shape[shape];

        for (let i = 0; i < s.length; i++) {
            let x = this.mapX + s[i][0] + offsetX;
            let y = this.mapY + s[i][1] + offsetY;
            y = y < 0 ? 0 : y;

            positions.push([x, y]);
        }

        return positions;
    }

    move(offsetX = 0, offsetY = 0) {
        this.mapX += offsetX;
        this.mapY += offsetY;
    }

    getColor() {
        return Tetromino.modules[this.type].color;
    }

    drawBlockOutline(color, x, y) {
        const ctx = this.ctx;
        const size = this.config.tetrominoSize;
        const lineWidth = 6;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeRect(x + lineWidth, y + lineWidth, size - lineWidth * 2, size - lineWidth * 2);
        // return line width to normal
        ctx.lineWidth = 1;
    }

    drawBlock(color, x, y) {
        const ctx = this.ctx;
        const size = this.config.tetrominoSize;
        const centerSize = Math.round(size * 0.6);
        const gap = Math.ceil((size - centerSize) / 2);
        const colorLuminance = Tetromino.colorLuminance;

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
        ctx.fillRect(x + gap, y + gap, centerSize, centerSize)
    }

    /**
     * to make a hex color lighter or darker
     * @param hex, the original hex color(e.g. `f00`, `ff1211`, `#232`, `#232323`)
     * @param lum, a number between -1 and 1 to make color lighter(positive) or darker(negative)
     * @returns {string} the result hex color include `#`
     */
    static colorLuminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

    save(key = 'TetrisTetromino') {
        const t = {type: this.type, shape: this.shape};
        localStorage[key] = JSON.stringify(t);
    }

    load(key = 'TetrisTetromino') {
        const t = JSON.parse(localStorage[key]);
        this.type = parseInt(t.type);
        this.shape = parseInt(t.shape);
        this._initCoordinates();
    }
}

// see all modules design in README.md
Tetromino.modules = [];

const O = {};
O.shape = [];
O.shape.push([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
O.color = '#ff0';// yellow
Tetromino.modules.push(O);

const I = {};
I.shape = [];
I.shape.push([[0, -2], [0, -1], [0, 0], [0, 1]]);
I.shape.push([[-2, 0], [-1, 0], [0, 0], [1, 0]]);
I.color = '#0ff';// cyan
Tetromino.modules.push(I);

const S = {};
S.shape = [];
S.shape.push([[-1, -1], [-1, 0], [0, 0], [0, 1]]);
S.shape.push([[0, -1], [1, -1], [-1, 0], [0, 0]]);
S.color = '#80ff00';// lime
Tetromino.modules.push(S);

const Z = {};
Z.shape = [];
Z.shape.push([[0, -1], [-1, 0], [0, 0], [-1, 1]]);
Z.shape.push([[-1, -1], [0, -1], [0, 0], [1, 0]]);
Z.color = '#f00';// red
Tetromino.modules.push(Z);

const L = {};
L.shape = [];
L.shape.push([[-1, -1], [0, -1], [0, 0], [0, 1]]);
L.shape.push([[1, -1], [-1, 0], [0, 0], [1, 0]]);
L.shape.push([[0, -1], [0, 0], [0, 1], [1, 1]]);
L.shape.push([[-1, 0], [0, 0], [1, 0], [-1, 1]]);
L.color = '#ffa500';// orange
Tetromino.modules.push(L);

const J = {};
J.shape = [];
J.shape.push([[0, -1], [1, -1], [0, 0], [0, 1]]);
J.shape.push([[-1, 0], [0, 0], [1, 0], [1, 1]]);
J.shape.push([[0, -1], [0, 0], [-1, 1], [0, 1]]);
J.shape.push([[-1, -1], [-1, 0], [0, 0], [1, 0]]);
J.color = '#00f';// blue
Tetromino.modules.push(J);

const T = {};
T.shape = [];
T.shape.push([[0, -1], [-1, 0], [0, 0], [1, 0]]);
T.shape.push([[0, -1], [0, 0], [1, 0], [0, 1]]);
T.shape.push([[-1, 0], [0, 0], [1, 0], [0, 1]]);
T.shape.push([[0, -1], [-1, 0], [0, 0], [0, 1]]);
T.color = '#800080';// purple
Tetromino.modules.push(T);