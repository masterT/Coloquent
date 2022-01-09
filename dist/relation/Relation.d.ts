import { Model } from "../Model";
export declare class Relation<R extends Model = Model> {
    private relatedType;
    private referringObject;
    private name;
    constructor(relatedType: any, referringObject?: R | undefined, name?: string | undefined);
    getType(): any;
    getReferringObject(): Model;
    getName(): string;
}
