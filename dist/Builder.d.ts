import { Model } from "./Model";
import { PluralResponse } from "./response/PluralResponse";
import { SingularResponse } from "./response/SingularResponse";
import { Query } from "./Query";
import { QueryMethods } from "./QueryMethods";
import { SortDirection } from "./SortDirection";
import { RetrievalResponse } from "./response/RetrievalResponse";
export declare class Builder<M extends Model = Model, GET_RESPONSE extends RetrievalResponse<M> = PluralResponse<M>> implements QueryMethods<M, GET_RESPONSE> {
    protected readonly baseUrl: string;
    protected readonly modelType: any;
    private readonly httpClient;
    private query;
    /**
     * If true, then this function will in all cases return a SingularResponse. This is used by ToOneRelations, which
     * when queried spawn a Builder with this property set to true.
     */
    private readonly forceSingular;
    constructor(modelType: typeof Model, queriedRelationName?: string | undefined, baseModelJsonApiType?: string | undefined, baseModelJsonApiId?: string | undefined, forceSingular?: boolean);
    get(page?: number): Promise<GET_RESPONSE>;
    first(): Promise<SingularResponse<M>>;
    limit(limit: number): Builder<M, GET_RESPONSE>;
    find(id: string | number): Promise<SingularResponse<M>>;
    where(attribute: string, value: string): Builder<M, GET_RESPONSE>;
    with(value: any): Builder<M, GET_RESPONSE>;
    orderBy(attribute: string, direction?: SortDirection | string): Builder<M, GET_RESPONSE>;
    option(queryParameter: string, value: string): Builder<M, GET_RESPONSE>;
    private clone;
    getQuery(): Query;
    setQuery(query: Query): void;
    private initPaginationSpec;
    private getHttpClient;
}
