"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SortSpec {
    constructor(attribute, positiveDirection = true) {
        this.attribute = attribute;
        this.positiveDirection = positiveDirection;
    }
    getAttribute() {
        return this.attribute;
    }
    getPositiveDirection() {
        return this.positiveDirection;
    }
}
exports.SortSpec = SortSpec;
//# sourceMappingURL=SortSpec.js.map