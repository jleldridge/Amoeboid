class Player {
    constructor(x, y, size) {
        this.init(x, y, size);
    }

    init(x, y, size) {
        this._x = x;
        this._y = y;
        this._size = size;
        this._dx = 0;
        this._dy = 0;
        this._lives = 1;
        this._invulnerable = false;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get dx() {
        return this._dx;
    }

    set dx(value) {
        this._dx = value;
    }

    get dy() {
        return this._dy;
    }

    set dy(value) {
        this._dy = value;
    }

    get lives() {
        return this._lives;
    }

    set lives(value) {
        this._lives = value;
    }

    get invulnerable() {
        return this._invulnerable;
    }

    set invulnerable(value) {
        this._invulnerable = value;
    }
}