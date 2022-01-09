import { Resource } from "./Resource";
export declare class JsonApiResponseBody {
    data: Resource | Resource[] | null | undefined;
    included: Resource[];
}
