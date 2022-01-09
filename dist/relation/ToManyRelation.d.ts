import { Relation } from "./Relation";
import { QueryMethods } from "../QueryMethods";
import { Builder } from "../Builder";
import { PluralResponse } from "../response/PluralResponse";
import { SingularResponse } from "../response/SingularResponse";
import { SortDirection } from "../SortDirection";
import { Model } from "../Model";
export declare class ToManyRelation<M extends Model = Model, R extends Model = Model> extends Relation<R> implements QueryMethods<M, PluralResponse<M>> {
    get(page?: number): Promise<PluralResponse<M>>;
    first(): Promise<SingularResponse<M>>;
    find(id: string | number): Promise<SingularResponse<M>>;
    where(attribute: string, value: string): Builder<M>;
    with(value: any): Builder<M>;
    orderBy(attribute: string, direction?: SortDirection | string): Builder<M>;
    option(queryParameter: string, value: string): Builder<M>;
}
