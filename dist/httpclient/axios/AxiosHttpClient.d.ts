import { HttpClient } from "../HttpClient";
import { AxiosInstance } from "axios";
import { HttpClientPromise } from "../HttpClientPromise";
export declare class AxiosHttpClient implements HttpClient {
    private axiosInstance;
    private withCredentials;
    constructor();
    setWithCredentials(withCredentials: boolean): void;
    get(url: string): HttpClientPromise;
    delete(url: string): HttpClientPromise;
    head(url: string): HttpClientPromise;
    post(url: string, data?: any): HttpClientPromise;
    put(url: string, data?: any): HttpClientPromise;
    patch(url: string, data?: any): HttpClientPromise;
    getImplementingClient(): AxiosInstance;
    private readonly config;
}
