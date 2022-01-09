"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Relation_1 = require("./Relation");
const Builder_1 = require("../Builder");
class ToOneRelation extends Relation_1.Relation {
    get(page) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .get(page);
    }
    first() {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .first();
    }
    find(id) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .find(id);
    }
    where(attribute, value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .where(attribute, value);
    }
    with(value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .with(value);
    }
    orderBy(attribute, direction) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .orderBy(attribute, direction);
    }
    option(queryParameter, value) {
        return new Builder_1.Builder(this.getType(), this.getName(), this.getReferringObject().getJsonApiType(), this.getReferringObject().getApiId(), true)
            .option(queryParameter, value);
    }
}
exports.ToOneRelation = ToOneRelation;
//# sourceMappingURL=ToOneRelation.js.map