"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./Builder");
const Map_1 = require("./util/Map");
const PaginationStrategy_1 = require("./PaginationStrategy");
const php_date_formatter_1 = __importDefault(require("php-date-formatter"));
const SaveResponse_1 = require("./response/SaveResponse");
const ToManyRelation_1 = require("./relation/ToManyRelation");
const ToOneRelation_1 = require("./relation/ToOneRelation");
const Reflection_1 = require("./util/Reflection");
const AxiosHttpClient_1 = require("./httpclient/axios/AxiosHttpClient");
class Model {
    constructor() {
        this.type = typeof this;
        this.relations = new Map_1.Map();
        this.attributes = new Map_1.Map();
        this.readOnlyAttributes = [];
        this.dates = {};
    }
    /**
     * Get a {@link Builder} instance from a {@link Model} instance
     * so you can query without having a static reference to your specific {@link Model}
     * class.
     */
    query() {
        return this.constructor.query();
    }
    /**
     * Get a {@link Builder} instance from a static {@link Model}
     * so you can start querying
     */
    static query() {
        return new Builder_1.Builder(this);
    }
    static get(page) {
        return new Builder_1.Builder(this)
            .get(page);
    }
    static first() {
        return new Builder_1.Builder(this)
            .first();
    }
    static find(id) {
        return new Builder_1.Builder(this)
            .find(id);
    }
    static with(attribute) {
        return new Builder_1.Builder(this)
            .with(attribute);
    }
    static limit(limit) {
        return new Builder_1.Builder(this)
            .limit(limit);
    }
    static where(attribute, value) {
        return new Builder_1.Builder(this)
            .where(attribute, value);
    }
    static orderBy(attribute, direction) {
        return new Builder_1.Builder(this)
            .orderBy(attribute, direction);
    }
    static option(queryParameter, value) {
        return new Builder_1.Builder(this)
            .option(queryParameter, value);
    }
    serialize() {
        let attributes = {};
        for (let key in this.attributes.toArray()) {
            if (this.readOnlyAttributes.indexOf(key) == -1) {
                attributes[key] = this.attributes.get(key);
            }
        }
        let relationships = {};
        for (let key in this.relations.toArray()) {
            let relation = this.relations.get(key);
            if (relation instanceof Model) {
                relationships[key] = this.serializeToOneRelation(relation);
            }
            else if (relation instanceof Array && relation.length > 0) {
                relationships[key] = this.serializeToManyRelation(relation);
            }
        }
        let payload = {
            data: {
                type: this.getJsonApiType(),
                attributes,
                relationships
            }
        };
        if (this.hasId) {
            payload['data']['id'] = this.id;
        }
        return payload;
    }
    serializeRelatedModel(model) {
        return {
            type: model.getJsonApiType(),
            id: model.id
        };
    }
    serializeToOneRelation(model) {
        return {
            data: this.serializeRelatedModel(model),
        };
    }
    serializeToManyRelation(models) {
        return {
            data: models.map((model) => this.serializeRelatedModel(model))
        };
    }
    save() {
        if (!this.hasId) {
            return this.create();
        }
        let payload = this.serialize();
        return this.getHttpClient()
            .patch(this.constructor.getJsonApiUrl() + '/' + this.id, payload)
            .then((response) => {
            const idFromJson = response.getData().data.id;
            this.setApiId(idFromJson);
            return new SaveResponse_1.SaveResponse(response, Object.getPrototypeOf(this).constructor, response.getData());
        }, (response) => {
            throw response;
        });
    }
    create() {
        let payload = this.serialize();
        return this.getHttpClient()
            .post(this.constructor.getJsonApiUrl(), payload)
            .then((response) => {
            const idFromJson = response.getData().data.id;
            this.setApiId(idFromJson);
            return new SaveResponse_1.SaveResponse(response, Object.getPrototypeOf(this).constructor, response.getData());
        }, function (response) {
            throw response;
        });
    }
    delete() {
        if (!this.hasId) {
            throw new Error('Cannot delete a model with no ID.');
        }
        return this.getHttpClient()
            .delete(this.constructor.getJsonApiUrl() + '/' + this.id)
            .then(function () { });
    }
    /**
     * @return A {@link Promise} resolving to:
     *
     * * the representation of this {@link Model} instance in the API if this {@link Model} has an ID and this ID can
     * be found in the API too
     * * `undefined` if this {@link Model} instance has no ID
     * * `null` if there _is_ an ID, but a {@link Model} with this ID cannot be found in the backend
     */
    fresh() {
        let model = (new this.constructor);
        let builder = model
            .query()
            .with(this.getRelationsKeys());
        if (this.getApiId()) {
            return builder
                .find(this.getApiId())
                .then((response) => {
                let model = response.getData();
                return model;
            }, (response) => {
                throw response;
            });
        }
        else {
            return Promise.resolve(undefined);
        }
    }
    getRelations() {
        return this.relations.toArray();
    }
    getRelationsKeys(parentRelationName) {
        let relationNames = [];
        for (let key in this.relations.toArray()) {
            let relation = this.getRelation(key);
            if (parentRelationName) {
                relationNames.push(parentRelationName + '.' + key);
            }
            else {
                relationNames.push(key);
            }
            if (Array.isArray(relation)) {
                relation.forEach((model) => {
                    relationNames = [...relationNames, ...model.getRelationsKeys(key)];
                });
            }
            else if (relation) {
                relationNames = [...relationNames, ...relation.getRelationsKeys(key)];
            }
        }
        return relationNames;
    }
    static getJsonApiBaseUrl() {
        if (!this.jsonApiBaseUrl) {
            throw new Error(`Expect ${this.name} to have property expect jsonApiBaseUrl defined`);
        }
        return this.jsonApiBaseUrl;
    }
    static getJsonApiType() {
        if (!this.jsonApiType) {
            throw new Error(`Expect ${this.name} to have property expect jsonApiType defined`);
        }
        return this.jsonApiType;
    }
    static getJsonApiUrl() {
        // TODO: Allow to explicitly set the endpoint.
        // E.g: const path = this.endpoint || `/${this.getJsonApiType()}`
        const path = `/${this.getJsonApiType()}`;
        return `${this.getJsonApiBaseUrl()}${path}`;
    }
    static getHttpClient() {
        if (!this.httpClient) {
            this.httpClient = new AxiosHttpClient_1.AxiosHttpClient();
        }
        return this.httpClient;
    }
    // Backward compatibility.
    getJsonApiType() {
        return this.constructor.getJsonApiType();
    }
    // Backward compatibility.
    getJsonApiBaseUrl() {
        return this.constructor.getJsonApiBaseUrl();
    }
    getHttpClient() {
        return this.constructor.getHttpClient();
    }
    populateFromResource(resource) {
        this.id = resource.id;
        for (let key in resource.attributes) {
            this.setAttribute(key, resource.attributes[key]);
        }
    }
    static getPageSize() {
        return this.pageSize;
    }
    static getPaginationStrategy() {
        return this.paginationStrategy;
    }
    static getPaginationPageNumberParamName() {
        return this.paginationPageNumberParamName;
    }
    static getPaginationPageSizeParamName() {
        return this.paginationPageSizeParamName;
    }
    static getPaginationOffsetParamName() {
        return this.paginationOffsetParamName;
    }
    static getPaginationLimitParamName() {
        return this.paginationLimitParName;
    }
    getRelation(relationName) {
        return this.relations.get(relationName);
    }
    setRelation(relationName, value) {
        this.relations.set(relationName, value);
    }
    getAttributes() {
        return this.attributes.toArray();
    }
    getAttribute(attributeName) {
        if (this.isDateAttribute(attributeName)) {
            return this.getAttributeAsDate(attributeName);
        }
        return this.attributes.get(attributeName);
    }
    getAttributeAsDate(attributeName) {
        if (!Date.parse(this.attributes.get(attributeName))) {
            throw new Error(`Attribute ${attributeName} cannot be cast to type Date`);
        }
        return new Date(this.attributes.get(attributeName));
    }
    isDateAttribute(attributeName) {
        return this.dates.hasOwnProperty(attributeName);
    }
    setAttribute(attributeName, value) {
        if (this.isDateAttribute(attributeName)) {
            if (!Date.parse(value)) {
                throw new Error(`${value} cannot be cast to type Date`);
            }
            value = Model.getDateFormatter().parseDate(value, this.dates[attributeName]);
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
    static getDateFormatter() {
        if (!this.dateFormatter) {
            this.dateFormatter = new php_date_formatter_1.default();
        }
        return this.dateFormatter;
    }
    getApiId() {
        return this.id;
    }
    setApiId(id) {
        this.id = id;
    }
    hasMany(relatedType, relationName) {
        if (typeof relationName === 'undefined') {
            relationName = Reflection_1.Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
        }
        return new ToManyRelation_1.ToManyRelation(relatedType, this, relationName);
    }
    hasOne(relatedType, relationName) {
        if (typeof relationName === 'undefined') {
            relationName = Reflection_1.Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
        }
        return new ToOneRelation_1.ToOneRelation(relatedType, this, relationName);
    }
    get hasId() {
        return this.id !== undefined
            && this.id !== null
            && this.id !== '';
    }
}
exports.Model = Model;
/**
 * @type {number} the page size
 */
Model.pageSize = 50;
/**
 * @type {PaginationStrategy} the pagination strategy
 */
Model.paginationStrategy = PaginationStrategy_1.PaginationStrategy.OffsetBased;
/**
 * @type {string} The number query parameter name. By default: 'page[number]'
 */
Model.paginationPageNumberParamName = 'page[number]';
/**
 * @type {string} The size query parameter name. By default: 'page[size]'
 */
Model.paginationPageSizeParamName = 'page[size]';
/**
 * @type {string} The offset query parameter name. By default: 'page[offset]'
 */
Model.paginationOffsetParamName = 'page[offset]';
/**
 * @type {string} The limit query parameter name. By default: 'page[limit]'
 */
Model.paginationLimitParName = 'page[limit]';
//# sourceMappingURL=Model.js.map