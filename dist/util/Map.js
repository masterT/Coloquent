"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Map {
    constructor() {
        this.data = {};
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
    }
    toArray() {
        return this.data;
    }
}
exports.Map = Map;
//# sourceMappingURL=Map.js.map