class MathHelper {
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    static random(min, max) {
        return (Math.random() * (max - min)) + min;
    }
}