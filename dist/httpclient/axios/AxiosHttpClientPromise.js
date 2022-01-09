"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AxiosHttpClientResponse_1 = require("./AxiosHttpClientResponse");
class AxiosHttpClientPromise {
    constructor(axiosPromise) {
        this.axiosPromise = axiosPromise;
    }
    then(onFulfilled, onRejected) {
        const wrappedOnFulfilled = onFulfilled !== undefined
            ?
                (axiosResponse => onFulfilled(new AxiosHttpClientResponse_1.AxiosHttpClientResponse(axiosResponse)))
            :
                undefined;
        return this.axiosPromise.then(wrappedOnFulfilled, onRejected);
    }
    catch(onRejected) {
        return this.axiosPromise.catch(onRejected);
    }
}
exports.AxiosHttpClientPromise = AxiosHttpClientPromise;
//# sourceMappingURL=AxiosHttpClientPromise.js.map