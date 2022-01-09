"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class SaveResponse extends Response_1.Response {
    constructor(httpClientResponse, modelType, responseBody) {
        super(undefined, httpClientResponse);
        const data = responseBody.data;
        if (data !== undefined && data !== null) {
            const model = new modelType();
            model.populateFromResource(responseBody.data);
            this.model = model;
        }
        else {
            this.model = null;
        }
    }
    getModel() {
        return this.model;
    }
    getModelId() {
        return this.model !== null
            ?
                this.model.getApiId()
            :
                undefined;
    }
}
exports.SaveResponse = SaveResponse;
//# sourceMappingURL=SaveResponse.js.map