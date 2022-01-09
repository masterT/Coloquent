"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryParam {
    constructor(name, value = null) {
        this._name = name;
        this._value = value;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
}
exports.QueryParam = QueryParam;
//# sourceMappingURL=QueryParam.js.map