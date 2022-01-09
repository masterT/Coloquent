import { HttpClientResponse } from "../httpclient/HttpClientResponse";
import { Query } from "../Query";
export declare abstract class Response {
    private _query;
    private axiosResponse;
    constructor(query: Query | undefined, axiosResponse: HttpClientResponse);
    getHttpClientResponse(): HttpClientResponse;
    protected readonly query: Query | undefined;
    protected readonly includeTree: any;
}
