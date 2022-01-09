import { JsonApiResponseBody } from "../JsonApiResponseBody";
import { Resource } from "../Resource";
import { Model } from "../Model";
import { Map } from "../util/Map";
import { Response } from "./Response";
import { HttpClientResponse } from "../httpclient/HttpClientResponse";
import { Query } from "../Query";
export declare abstract class RetrievalResponse<M extends Model = Model> extends Response {
    protected modelType: any;
    protected resourceIndex: Map<Map<Resource>>;
    protected modelIndex: Map<Map<M>>;
    protected included: M[];
    constructor(query: Query, httpClientResponse: HttpClientResponse, modelType: typeof Model, responseBody: JsonApiResponseBody);
    abstract getData(): any;
    getIncluded(): Model[];
    protected abstract makeModelIndex(requested: Resource | Resource[] | null | undefined): void;
    private indexIncludedDocs;
    protected abstract indexRequestedResources(requested: Resource | Resource[] | null | undefined): any;
    protected indexDoc(doc: Resource): void;
    protected indexAsModel(doc: Resource, modelType: any, includeTree: any): Model;
    protected abstract makeDataArray(requestedDocs: Resource | Resource[] | null | undefined): void;
    protected makeIncludedArray(includedDocs?: Resource[]): void;
    protected convertRelationNameToCamelCase(relationName: string): string;
    protected static coalesceUndefinedIntoNull<T>(value: T | undefined | null): T | null;
}
