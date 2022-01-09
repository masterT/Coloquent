import { HttpClientResponse } from "../HttpClientResponse";
import { AxiosPromise } from "axios";
import { HttpClientPromise } from "../HttpClientPromise";
import { Thenable } from "../Types";
export declare class AxiosHttpClientPromise implements HttpClientPromise {
    private axiosPromise;
    constructor(axiosPromise: AxiosPromise);
    then<U>(onFulfilled?: (value: HttpClientResponse) => (Thenable<U> | U), onRejected?: (error: any) => (Thenable<U> | U)): Promise<U>;
    catch<U>(onRejected?: (error: any) => (Thenable<U> | U)): Promise<U>;
}
