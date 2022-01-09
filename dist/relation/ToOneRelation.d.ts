import { Relation } from "./Relation";
import { Builder } from "../Builder";
import { SingularResponse } from "../response/SingularResponse";
import { QueryMethods } from "../QueryMethods";
import { SortDirection } from "../SortDirection";
import { Model } from "../Model";
export declare class ToOneRelation<M extends Model = Model, R extends Model = Model> extends Relation<R> implements QueryMethods<M, SingularResponse<M>> {
    get(page?: number): Promise<SingularResponse<M>>;
    first(): Promise<SingularResponse<M>>;
    find(id: string | number): Promise<SingularResponse<M>>;
    where(attribute: string, value: string): Builder<M, SingularResponse<M>>;
    with(value: any): Builder<M, SingularResponse<M>>;
    orderBy(attribute: string, direction?: SortDirection | string): Builder<M, SingularResponse<M>>;
    option(queryParameter: string, value: string): Builder<M, SingularResponse<M>>;
}
