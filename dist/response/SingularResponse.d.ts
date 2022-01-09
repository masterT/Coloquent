import { RetrievalResponse } from "./RetrievalResponse";
import { Model } from "../Model";
import { Resource } from "../Resource";
import { JsonApiResponseBody } from "../JsonApiResponseBody";
import { HttpClientResponse } from "../httpclient/HttpClientResponse";
import { Query } from "../Query";
export declare class SingularResponse<M extends Model = Model> extends RetrievalResponse<M> {
    protected data: M | null;
    constructor(query: Query, httpClientResponse: HttpClientResponse, modelType: typeof Model, responseBody: JsonApiResponseBody);
    getData(): M | null;
    protected makeModelIndex(data: Resource | Resource[] | null | undefined): void;
    protected indexRequestedResources(data: Resource | Resource[] | null | undefined): void;
    protected makeDataArray(data: Resource | Resource[] | null | undefined): void;
}
