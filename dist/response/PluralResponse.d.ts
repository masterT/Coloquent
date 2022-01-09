import { RetrievalResponse } from "./RetrievalResponse";
import { Model } from "../Model";
import { Resource } from "../Resource";
import { JsonApiResponseBody } from "../JsonApiResponseBody";
import { HttpClientResponse } from "../httpclient/HttpClientResponse";
import { Query } from "../Query";
export declare class PluralResponse<M extends Model = Model> extends RetrievalResponse<M> {
    protected data: M[];
    protected pageNumber: number;
    protected limit: number | undefined;
    constructor(query: Query, httpClientResponse: HttpClientResponse, modelType: typeof Model, responseBody: JsonApiResponseBody, pageNumber?: number);
    getPageNumber(): number;
    getData(): M[];
    protected indexRequestedResources(requestedResources?: Resource[]): void;
    protected makeModelIndex(requestedResources?: Resource[]): void;
    protected makeDataArray(requestedDocs?: Resource[]): void;
}
