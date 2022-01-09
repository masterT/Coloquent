"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterSpec_1 = require("./FilterSpec");
class ClassFilterSpec extends FilterSpec_1.FilterSpec {
    constructor(clazz, attribute, value) {
        super(attribute, value);
        this.clazz = clazz;
    }
    getClass() {
        return this.clazz;
    }
}
exports.ClassFilterSpec = ClassFilterSpec;
//# sourceMappingURL=ClassFilterSpec.js.map