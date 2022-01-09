import { Model } from "../Model";
import { Response } from "./Response";
import { JsonApiResponseBody } from "../JsonApiResponseBody";
import { HttpClientResponse } from "../httpclient/HttpClientResponse";
export declare class SaveResponse<M extends Model = Model> extends Response {
    protected readonly model: M | null;
    constructor(httpClientResponse: HttpClientResponse, modelType: Function, responseBody: JsonApiResponseBody);
    getModel(): Model | null;
    getModelId(): string | undefined;
}
