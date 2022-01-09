"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetrievalResponse_1 = require("./RetrievalResponse");
class PluralResponse extends RetrievalResponse_1.RetrievalResponse {
    constructor(query, httpClientResponse, modelType, responseBody, pageNumber = 1) {
        super(query, httpClientResponse, modelType, responseBody);
        this.pageNumber = pageNumber;
        this.limit = query.getLimit();
    }
    getPageNumber() {
        return Math.max(this.pageNumber, 1);
    }
    getData() {
        if (this.limit !== undefined && Array.isArray(this.data)) {
            return this.data.slice(0, this.limit);
        }
        else {
            return this.data;
        }
    }
    indexRequestedResources(requestedResources = []) {
        for (let doc of requestedResources) {
            this.indexDoc(doc);
        }
    }
    makeModelIndex(requestedResources = []) {
        for (let doc of requestedResources) {
            this.indexAsModel(doc, this.modelType, this.includeTree);
        }
    }
    makeDataArray(requestedDocs = []) {
        this.data = [];
        for (let doc of requestedDocs) {
            this.data.push(this.modelIndex.get(doc.type).get(doc.id));
        }
    }
}
exports.PluralResponse = PluralResponse;
//# sourceMappingURL=PluralResponse.js.map