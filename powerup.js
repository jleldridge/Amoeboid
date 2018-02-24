class Powerup {
    constructor(type, x, y, time) {
        this._type = type;
        this._x = x;
        this._y = y;
        this._time = time;
    }

    get size() { return 30; }

    get type() { return this._type; }
    set type(value) { this._type = value; }

    get x() { return this._x; }
    set x(value) { this._x = value; }

    get y() { return this._y; }
    set y(value) { this._y = value; }

    get time() { return this._time; }
    set time(value) { this._time = value; }
}