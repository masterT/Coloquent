"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const AxiosHttpClientPromise_1 = require("./AxiosHttpClientPromise");
class AxiosHttpClient {
    constructor(axiosInstance) {
        if (axiosInstance === null || axiosInstance === undefined) {
            axiosInstance = axios_1.default.create();
        }
        this.axiosInstance = axiosInstance;
    }
    setWithCredentials(withCredentials) {
        this.withCredentials = withCredentials;
    }
    get(url) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.get(url, this.config));
    }
    delete(url) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.delete(url, this.config));
    }
    head(url) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.head(url, this.config));
    }
    post(url, data) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.post(url, data, this.config));
    }
    put(url, data) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.put(url, data, this.config));
    }
    patch(url, data) {
        return new AxiosHttpClientPromise_1.AxiosHttpClientPromise(this.axiosInstance.patch(url, data, this.config));
    }
    getImplementingClient() {
        return this.axiosInstance;
    }
    get config() {
        return {
            withCredentials: this.withCredentials,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-type': 'application/vnd.api+json',
            }
        };
    }
}
exports.AxiosHttpClient = AxiosHttpClient;
//# sourceMappingURL=AxiosHttpClient.js.map