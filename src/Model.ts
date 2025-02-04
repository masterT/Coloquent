import {Builder} from "./Builder";
import {Resource} from "./Resource";
import {Map} from "./util/Map";
import {AxiosError} from "axios";
import {PluralResponse} from "./response/PluralResponse";
import {SingularResponse} from "./response/SingularResponse";
import {PaginationStrategy} from "./PaginationStrategy";
import DateFormatter from "php-date-formatter";
import {SaveResponse} from "./response/SaveResponse";
import {ToManyRelation} from "./relation/ToManyRelation";
import {ToOneRelation} from "./relation/ToOneRelation";
import {Reflection} from "./util/Reflection";
import {HttpClient} from "./httpclient/HttpClient";
import {AxiosHttpClient} from "./httpclient/axios/AxiosHttpClient";
import {HttpClientResponse} from "./httpclient/HttpClientResponse";

export interface Model {
    constructor: typeof Model;
}
export abstract class Model
{
    /**
     * The page size
     */
    protected static pageSize: number = 50;

    /**
     * The pagination strategy
     */
    protected static paginationStrategy: PaginationStrategy = PaginationStrategy.OffsetBased;

    /**
     * The number query parameter name. By default: 'page[number]'
     */
    protected static paginationPageNumberParamName: string = 'page[number]';

    /**
     * The size query parameter name. By default: 'page[size]'
     */
    protected static paginationPageSizeParamName: string = 'page[size]';

    /**
     * The offset query parameter name. By default: 'page[offset]'
     */
    protected static paginationOffsetParamName: string = 'page[offset]';

    /**
     * The limit query parameter name. By default: 'page[limit]'
     */
    protected static paginationLimitParName: string = 'page[limit]';

    private id: string | undefined;

    private readonly relations = new Map<any>();

    private readonly attributes = new Map<any>();

    /**
     * The model endpoint base URL, e.g 'http://localhost:3000/api/v1'.
     */
    protected static jsonApiBaseUrl: string | undefined;

    private static _effectiveJsonApiBaseUrl: string | undefined;

    /**
     * The JSON-API type, choose plural, lowercase alphabetic only, e.g. 'artists'.
     * Required property. If not set, Colu
     */
    protected static jsonApiType: string | undefined;

    private static _effectiveJsonApiType: string | undefined;

    /**
     * The endpoint. Optional. If not set, the {@link Model.jsonApiType}
     * prepended with a slash (e.g. "/cars") will be used.
     */
    protected static endpoint: string | undefined;

    /**
     * @type {HttpClient} The HTTP client used to perform request for this model.
     * If not set, {@link AxiosHttpClient} will be used.
     */
    protected static httpClient: HttpClient | undefined;

    private static _effectiveHttpClient: HttpClient | undefined;

    protected static readOnlyAttributes: string[] = [];

    protected static dates: {[key: string]: string} = {};

    private static dateFormatter: DateFormatter | undefined;

    /**
     * Get a {@link Builder} instance from a {@link Model} instance
     * so you can query without having a static reference to your specific {@link Model}
     * class.
     */
    public query(): Builder<this, PluralResponse<this>>
    {
        return this.constructor.query();
    }

    /**
     * Get a {@link Builder} instance from a static {@link Model}
     * so you can start querying
     */
    public static query<M extends Model>(): Builder<M, PluralResponse<M>>
    {
        return new Builder<M>(this);
    }

    public static get<M extends typeof Model & {new(): Model}>(this: M, page?: number): Promise<PluralResponse<InstanceType<M>>>
    {
        return <Promise<PluralResponse<InstanceType<M>>>> new Builder(this)
            .get(page);
    }

    public static first<M extends typeof Model & {new(): Model}>(this: M): Promise<SingularResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .first();
    }

    public static find<M extends typeof Model & {new(): Model}>(this: M, id: string | number): Promise<SingularResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .find(id);
    }

    public static with<M extends typeof Model & {new(): Model}>(this: M, attribute: any): Builder<InstanceType<M>, PluralResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .with(attribute);
    }

    public static limit<M extends typeof Model & {new(): Model}>(this: M, limit: number): Builder<InstanceType<M>, PluralResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .limit(limit);
    }

    public static where<M extends typeof Model & {new(): Model}>(this: M, attribute: string, value: string): Builder<InstanceType<M>, PluralResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .where(attribute, value);
    }

    public static orderBy<M extends typeof Model & {new(): Model}>(this: M, attribute: string, direction?: string): Builder<InstanceType<M>, PluralResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .orderBy(attribute, direction);
    }

    public static option<M extends typeof Model & {new(): Model}>(this: M, queryParameter: string, value: string): Builder<InstanceType<M>, PluralResponse<InstanceType<M>>>
    {
        return new Builder<InstanceType<M>>(this)
            .option(queryParameter, value);
    }

    private serialize()
    {
        let attributes = {};
        for (let key in this.attributes.toArray()) {
            if ((this as Model).constructor.readOnlyAttributes.indexOf(key) == -1) {
                attributes[key] = this.attributes.get(key);
            }
        }
        let relationships = {};
        for (let key in this.relations.toArray()) {
            let relation = this.relations.get(key);
            if (relation instanceof Model) {
                relationships[key] = this.serializeToOneRelation(relation);
            } else if (relation instanceof Array && relation.length > 0) {
                relationships[key] = this.serializeToManyRelation(relation);
            }
        }

        let payload = {
            data: {
                type: (this as Model).constructor.effectiveJsonApiType,
                attributes,
                relationships
            }
        };
        if (this.hasId) {
            payload['data']['id'] = this.id;
        }
        return payload;
    }

    private serializeRelatedModel(model: Model): any {
        return {
            type: model.constructor.effectiveJsonApiType,
            id: model.id
        };
    }

    private serializeToOneRelation(model: Model): any {
        return {
            data: this.serializeRelatedModel(model),
        }
    }

    private serializeToManyRelation(models: Model[]) {
        return {
            data: models.map((model) => this.serializeRelatedModel(model))
        };
    }

    public save(): Promise<SaveResponse<this>>
    {
        if (!this.hasId) {
            return this.create();
        }

        let payload = this.serialize();
        return (this as Model).constructor.effectiveHttpClient
            .patch(
                (this as Model).constructor.getJsonApiUrl()+'/'+this.id,
                payload
            )
            .then(
                (response: HttpClientResponse) => {
                    const idFromJson: string | undefined = response.getData().data.id;
                    this.setApiId(idFromJson);
                    return new SaveResponse(response, Object.getPrototypeOf(this).constructor, response.getData());
                },
                (response: AxiosError) => {
                    throw response;
                }
            );
    }

    public create(): Promise<SaveResponse<this>>
    {
        let payload = this.serialize();
        return (this as Model).constructor.effectiveHttpClient
            .post(
                (this as Model).constructor.getJsonApiUrl(),
                payload
            )
            .then(
                (response: HttpClientResponse) => {
                    const idFromJson: string | undefined = response.getData().data.id;
                    this.setApiId(idFromJson);
                    return new SaveResponse(response, Object.getPrototypeOf(this).constructor, response.getData());
                },
                function (response: AxiosError) {
                    throw response;
                }
            );
    }

    public delete(): Promise<void>
    {
        if (!this.hasId) {
            throw new Error('Cannot delete a model with no ID.');
        }
        return (this as Model).constructor.effectiveHttpClient
            .delete((this as Model).constructor.getJsonApiUrl()+'/'+this.id)
            .then(function () {});
    }

    /**
     * @return A {@link Promise} resolving to:
     *
     * * the representation of this {@link Model} instance in the API if this {@link Model} has an ID and this ID can
     * be found in the API too
     * * `undefined` if this {@link Model} instance has no ID
     * * `null` if there _is_ an ID, but a {@link Model} with this ID cannot be found in the backend
     */
    public fresh(): Promise<this | null | undefined>
    {
        let model = <this> (new (<any> this.constructor));
        let builder = model
                        .query()
                        .with(this.getRelationsKeys());

        if (this.getApiId()) {
            return builder
                .find(<string>this.getApiId())
                .then(
                    (response: SingularResponse<this>) => {
                        let model = response.getData();
                        return model;
                    },
                    (response: AxiosError) => {
                        throw response;
                    }
                );
        } else {
            return Promise.resolve(undefined);
        }
    }

    public getRelations()
    {
        return this.relations.toArray();
    }

    public getRelationsKeys(parentRelationName?: string): Array<string>
    {
        let relationNames: Array<string> = [];

        for (let key in this.relations.toArray()){
            let relation = this.getRelation(key);

            if (parentRelationName) {
                relationNames.push(parentRelationName + '.' +key);
            } else {
                relationNames.push(key);
            }

            if (Array.isArray(relation)) {
                relation.forEach((model: Model) => {
                    relationNames = [...relationNames, ...model.getRelationsKeys(key)]
                });
            } else if (relation) {
                relationNames = [...relationNames, ...relation.getRelationsKeys(key)]
            }
        }

        return relationNames;
    }

    /**
     * The base URL that is used to call the API
     */
    public static get effectiveJsonApiBaseUrl(): string {
      if (this._effectiveJsonApiBaseUrl === undefined) {
          if (this.jsonApiBaseUrl === undefined) {
              throw new Error(`Expected ${this.name} to have static property 'jsonApiBaseUrl' defined`)
          }
          this._effectiveJsonApiBaseUrl = this.jsonApiBaseUrl.replace(/\/+$/, '');
      }
      return this._effectiveJsonApiBaseUrl;
    }

    public static get effectiveJsonApiType(): string {
        if (this._effectiveJsonApiType === undefined) {
            if (this.jsonApiType === undefined) {
                throw new Error(
                    `Expected ${this.name} to have property expect jsonApiType defined`
                );
            }
            this._effectiveJsonApiType = this.jsonApiType;
        }
        return this._effectiveJsonApiType;
    }

    private static get effectiveEndpoint(): string {
        return (this.endpoint ?? this.effectiveJsonApiType).replace(/^\/+/, '').replace(/\/+$/, '')
    }

    public static getJsonApiUrl(): string {
      return `${this.effectiveJsonApiBaseUrl}/${this.effectiveEndpoint}`
    }

    /**
     * The {@link HttpClient} that is used by Coloquent. Is equal to {@link httpClient}
     * property unless that one was left undefined, in which case it is an instance
     * of {@link AxiosHttpClient}. This is a read-only property.
     */
    public static get effectiveHttpClient(): HttpClient
    {
      if (this._effectiveHttpClient === undefined) {
        this._effectiveHttpClient = this.httpClient ?? new AxiosHttpClient();
      }
      return this._effectiveHttpClient;
    }

    /**
     * @deprecated Use the static method with the same name instead
     */
    public getJsonApiType(): string {
      return (this as Model).constructor.effectiveJsonApiType;
    }

    /**
     * @deprecated Use the static property {@link jsonApiBaseUrl} or
     * {@link effectiveJsonApiBaseUrl}
     */
    public getJsonApiBaseUrl(): string {
      return (this as Model).constructor.effectiveJsonApiBaseUrl;
    }

    /**
     * @deprecated Use the static {@link httpClient} to get the one that is
     * configured, and {@link effectiveHttpClient} to get the one that is
     */
    public getHttpClient(): HttpClient {
      return (this as Model).constructor.effectiveHttpClient
    }

    public populateFromResource(resource: Resource): void
    {
        this.id = resource.id;
        for (let key in resource.attributes) {
            this.setAttribute(key, resource.attributes[key]);
        }
    }

    /**
     * @deprecated Access the static {@link pageSize} property directly
     */
    public static getPageSize(): number
    {
        return this.pageSize;
    }

    public static getPaginationStrategy(): PaginationStrategy
    {
        return this.paginationStrategy;
    }

    public static getPaginationPageNumberParamName(): string
    {
        return this.paginationPageNumberParamName;
    }

    public static getPaginationPageSizeParamName(): string
    {
        return this.paginationPageSizeParamName;
    }

    public static getPaginationOffsetParamName(): string
    {
        return this.paginationOffsetParamName;
    }

    public static getPaginationLimitParamName(): string
    {
        return this.paginationLimitParName;
    }

    protected getRelation(relationName: string): any
    {
        return this.relations.get(relationName);
    }

    public setRelation(relationName: string, value: any): void
    {
        this.relations.set(relationName, value);
    }

    public getAttributes(): {[key: string]: any}
    {
        return this.attributes.toArray();
    }

    protected getAttribute(attributeName: string): any
    {
        if (this.isDateAttribute(attributeName)) {
            return this.getAttributeAsDate(attributeName);
        }

        return this.attributes.get(attributeName);
    }

    protected getAttributeAsDate(attributeName: string): any
    {
        if (!Date.parse(this.attributes.get(attributeName))) {
            throw new Error(`Attribute ${attributeName} cannot be cast to type Date`);
        }

        return new Date(this.attributes.get(attributeName));
    }

    private isDateAttribute(attributeName: string): boolean
    {
        return (this as Model).constructor.dates.hasOwnProperty(attributeName);
    }

    protected setAttribute(attributeName: string, value: any): void
    {
        if (this.isDateAttribute(attributeName)) {
            if (!Date.parse(value)) {
                throw new Error(`${value} cannot be cast to type Date`);
            }
            value = (<any> Model.getDateFormatter()).parseDate(value, (this as Model).constructor.dates[attributeName]);
        }

        this.attributes.set(attributeName, value);
    }

    /**
     * We use a single instance of DateFormatter, which is stored as a static property on Model, to minimize the number
     * of times we need to instantiate the DateFormatter class. By using this getter a DateFormatter is instantiated
     * only when it is used at least once.
     *
     * @returns DateFormatter
     */
    private static getDateFormatter(): DateFormatter
    {
        if (!this.dateFormatter) {
            this.dateFormatter = new DateFormatter();
        }
        return this.dateFormatter;
    }

    public getApiId(): string | undefined
    {
        return this.id;
    }

    public setApiId(id: string | undefined): void
    {
        this.id = id;
    }

    protected hasMany<R extends Model>(relatedType: typeof Model): ToManyRelation<R, this>;
    protected hasMany<R extends Model>(relatedType: typeof Model, relationName: string): ToManyRelation<R, this>;
    protected hasMany<R extends Model>(relatedType: typeof Model, relationName?: string): ToManyRelation<R, this>
    {
        if (typeof relationName === 'undefined') {
            relationName = Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
        }
        return new ToManyRelation(relatedType, this, relationName);
    }

    protected hasOne<R extends Model>(relatedType: typeof Model): ToOneRelation<R, this>;
    protected hasOne<R extends Model>(relatedType: typeof Model, relationName: string): ToOneRelation<R, this>;
    protected hasOne<R extends Model>(relatedType: typeof Model, relationName?: string): ToOneRelation<R, this>
    {
        if (typeof relationName === 'undefined') {
            relationName = Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
        }
        return new ToOneRelation(relatedType, this, relationName);
    }

    private get hasId(): boolean
    {
        return this.id !== undefined
            && this.id !== null
            && this.id !== '';
    }
}
