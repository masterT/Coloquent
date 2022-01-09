"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetrievalResponse_1 = require("./RetrievalResponse");
class SingularResponse extends RetrievalResponse_1.RetrievalResponse {
    constructor(query, httpClientResponse, modelType, responseBody) {
        super(query, httpClientResponse, modelType, responseBody);
    }
    getData() {
        return this.data;
    }
    makeModelIndex(data) {
        const doc = Array.isArray(data)
            ?
                SingularResponse.coalesceUndefinedIntoNull(data[0])
            :
                SingularResponse.coalesceUndefinedIntoNull(data);
        if (doc) {
            this.indexAsModel(doc, this.modelType, this.includeTree);
        }
    }
    indexRequestedResources(data) {
        const doc = Array.isArray(data)
            ?
                SingularResponse.coalesceUndefinedIntoNull(data[0])
            :
                SingularResponse.coalesceUndefinedIntoNull(data);
        if (doc) {
            this.indexDoc(doc);
        }
    }
    makeDataArray(data) {
        const doc = Array.isArray(data)
            ?
                SingularResponse.coalesceUndefinedIntoNull(data[0])
            :
                SingularResponse.coalesceUndefinedIntoNull(data);
        if (doc !== null) {
            this.data = this.modelIndex.get(doc.type).get(doc.id);
        }
        else {
            this.data = null;
        }
    }
}
exports.SingularResponse = SingularResponse;
//# sourceMappingURL=SingularResponse.js.map