"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Reflection_1 = require("../util/Reflection");
class Relation {
    constructor(relatedType, referringObject = undefined, name = undefined) {
        this.relatedType = relatedType;
        this.referringObject = referringObject;
        if (name !== undefined) {
            this.name = name;
        }
        else {
            const calculatedName = Reflection_1.Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
            if (calculatedName === undefined) {
                throw new Error('Relationship name could not be automatically determined. '
                    + 'It is recommended to provide the relationship name explicitly in the relationship definition.');
            }
            this.name = calculatedName;
        }
    }
    getType() {
        return this.relatedType;
    }
    getReferringObject() {
        if (!this.referringObject) {
            throw new Error("Referring type not set on this relation. You should define the relation on your model with e.g." +
                " 'this.hasMany(...)' instead of with 'new ToManyRelation(...)'");
        }
        return this.referringObject;
    }
    getName() {
        if (!this.name) {
            throw new Error("Cannot deduce name of relation. You should define the relation on your model with e.g." +
                " 'this.hasMany(...)' instead of with 'new ToManyRelation(...)'");
        }
        return this.name;
    }
}
exports.Relation = Relation;
//# sourceMappingURL=Relation.js.map