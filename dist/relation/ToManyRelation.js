"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Relation_1 = require("./Relation");
const Builder_1 = require("../Builder");
class ToManyRelation extends Relation_1.Relation {
    get(page) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .get(page);
    }
    first() {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .first();
    }
    find(id) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .find(id);
    }
    where(attribute, value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .where(attribute, value);
    }
    with(value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .with(value);
    }
    orderBy(attribute, direction) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .orderBy(attribute, direction);
    }
    option(queryParameter, value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId())
            .option(queryParameter, value);
    }
}
exports.ToManyRelation = ToManyRelation;
//# sourceMappingURL=ToManyRelation.js.map