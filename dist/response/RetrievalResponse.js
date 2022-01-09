"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToManyRelation_1 = require("../relation/ToManyRelation");
const ToOneRelation_1 = require("../relation/ToOneRelation");
const Map_1 = require("../util/Map");
const Response_1 = require("./Response");
class RetrievalResponse extends Response_1.Response {
    constructor(query, httpClientResponse, modelType, responseBody) {
        super(query, httpClientResponse);
        this.modelType = modelType;
        this.resourceIndex = new Map_1.Map();
        this.modelIndex = new Map_1.Map();
        // Index the JsonApiDocs
        this.indexIncludedDocs(responseBody.included);
        this.indexRequestedResources(responseBody.data);
        // Build Models from the JsonApiDocs, for which the previously built indexes come in handy
        this.makeModelIndex(responseBody.data);
        // Prepare arrays for immediate access through this.getData() and this.getIncluded()
        this.makeDataArray(responseBody.data);
        this.makeIncludedArray(responseBody.included);
    }
    getIncluded() {
        return this.included;
    }
    indexIncludedDocs(includedDocs = []) {
        for (let doc of includedDocs) {
            this.indexDoc(doc);
        }
    }
    indexDoc(doc) {
        let type = doc.type;
        let id = doc.id;
        if (!this.resourceIndex.get(type)) {
            this.resourceIndex.set(type, new Map_1.Map());
        }
        this.resourceIndex.get(type).set(id, doc);
    }
    indexAsModel(doc, modelType, includeTree) {
        let type = doc.type;
        let id = doc.id;
        if (!this.modelIndex.get(type)) {
            this.modelIndex.set(type, new Map_1.Map());
        }
        let model = new modelType();
        model.populateFromResource(doc);
        this.modelIndex.get(type).set(id, model);
        for (let resourceRelationName in Object.assign(Object.assign({}, includeTree), doc.relationships)) {
            const modelRelationName = this.convertRelationNameToCamelCase(resourceRelationName);
            if (model[modelRelationName] === undefined) {
                continue;
            }
            const includeSubtree = includeTree ? includeTree[resourceRelationName] : {};
            let relation = model[modelRelationName]();
            if (relation instanceof ToManyRelation_1.ToManyRelation) {
                let relatedStubs = (doc.relationships !== undefined && doc.relationships[resourceRelationName] !== undefined)
                    ?
                        doc.relationships[resourceRelationName].data
                    :
                        undefined;
                let r = [];
                if (relatedStubs) {
                    for (let stub of relatedStubs) {
                        let relatedDoc = this.resourceIndex.get(stub.type).get(stub.id);
                        let relatedModel = this.indexAsModel(relatedDoc, relation.getType(), includeSubtree);
                        r.push(relatedModel);
                    }
                }
                model.setRelation(modelRelationName, r);
            }
            else if (relation instanceof ToOneRelation_1.ToOneRelation) {
                let stub = (doc.relationships !== undefined && doc.relationships[resourceRelationName] !== undefined)
                    ?
                        doc.relationships[resourceRelationName].data
                    :
                        undefined;
                let relatedModel = null;
                if (stub) {
                    let typeMap = this.resourceIndex.get(stub.type);
                    if (typeMap) {
                        let relatedDoc = typeMap.get(stub.id);
                        relatedModel = this.indexAsModel(relatedDoc, relation.getType(), includeSubtree);
                    }
                }
                model.setRelation(modelRelationName, relatedModel);
            }
            else {
                throw new Error('Unknown type of Relation encountered: ' + typeof relation);
            }
        }
        return model;
    }
    makeIncludedArray(includedDocs = []) {
        this.included = [];
        for (let doc of includedDocs) {
            const models = this.modelIndex.get(doc.type);
            if (models !== undefined) {
                this.included.push(models.get(doc.id));
            }
        }
    }
    convertRelationNameToCamelCase(relationName) {
        return relationName.replace(/-\w/g, (m) => m[1].toUpperCase());
    }
    static coalesceUndefinedIntoNull(value) {
        return value !== undefined
            ?
                value
            :
                null;
    }
}
exports.RetrievalResponse = RetrievalResponse;
//# sourceMappingURL=RetrievalResponse.js.map