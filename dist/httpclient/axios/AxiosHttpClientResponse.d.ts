import { HttpClientResponse } from "../HttpClientResponse";
import { AxiosResponse } from "axios";
export declare class AxiosHttpClientResponse implements HttpClientResponse {
    private axiosResponse;
    constructor(axiosResponse: AxiosResponse);
    getData(): any;
    getUnderlying(): any;
}
