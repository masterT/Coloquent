"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AxiosHttpClientResponse {
    constructor(axiosResponse) {
        this.axiosResponse = axiosResponse;
    }
    getData() {
        return this.axiosResponse.data;
    }
    getUnderlying() {
        return this.axiosResponse;
    }
}
exports.AxiosHttpClientResponse = AxiosHttpClientResponse;
//# sourceMappingURL=AxiosHttpClientResponse.js.map