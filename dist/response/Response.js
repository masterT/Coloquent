"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(query, axiosResponse) {
        this._query = query;
        this.axiosResponse = axiosResponse;
    }
    getHttpClientResponse() {
        return this.axiosResponse;
    }
    get query() {
        return this._query;
    }
    get includeTree() {
        return this.query !== undefined
            ?
                this.query.includeTree
            :
                {};
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map