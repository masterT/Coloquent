"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FilterSpec_1 = require("./FilterSpec");
const SortSpec_1 = require("./SortSpec");
const PluralResponse_1 = require("./response/PluralResponse");
const SingularResponse_1 = require("./response/SingularResponse");
const Option_1 = require("./Option");
const PaginationStrategy_1 = require("./PaginationStrategy");
const OffsetBasedPaginationSpec_1 = require("./paginationspec/OffsetBasedPaginationSpec");
const PageBasedPaginationSpec_1 = require("./paginationspec/PageBasedPaginationSpec");
const Query_1 = require("./Query");
const SortDirection_1 = require("./SortDirection");
class Builder {
    constructor(modelType, queriedRelationName = undefined, baseModelJsonApiType = undefined, baseModelJsonApiId = undefined, forceSingular = false) {
        this.modelType = modelType;
        this.baseUrl = modelType.getJsonApiBaseUrl();
        let modelInstance = (new modelType());
        baseModelJsonApiType = baseModelJsonApiType
            ? baseModelJsonApiType
            : modelInstance.getJsonApiType();
        this.query = new Query_1.Query(baseModelJsonApiType, queriedRelationName, baseModelJsonApiId);
        this.initPaginationSpec();
        this.httpClient = modelType.getHttpClient();
        this.forceSingular = forceSingular;
    }
    get(page = 0) {
        const clone = this.clone();
        clone.getQuery().getPaginationSpec().setPage(page);
        if (this.forceSingular) {
            return this.getHttpClient()
                .get(this.baseUrl + clone.getQuery().toString())
                .then((response) => {
                return new SingularResponse_1.SingularResponse(clone.getQuery(), response, this.modelType, response.getData());
            }, function (response) {
                throw new Error(response.message);
            });
        }
        else {
            return this.getHttpClient()
                .get(this.baseUrl + clone.getQuery().toString())
                .then((response) => {
                return new PluralResponse_1.PluralResponse(clone.getQuery(), response, this.modelType, response.getData(), page);
            }, function (response) {
                throw new Error(response.message);
            });
        }
    }
    first() {
        const clone = this.clone();
        clone.getQuery().getPaginationSpec().setPageLimit(1);
        return this.getHttpClient()
            .get(this.baseUrl + clone.getQuery().toString())
            .then((response) => {
            return new SingularResponse_1.SingularResponse(this.query, response, this.modelType, response.getData());
        }, function (response) {
            throw new Error(response.message);
        });
    }
    limit(limit) {
        const clone = this.clone();
        clone.getQuery().setLimit(limit);
        return clone;
    }
    find(id) {
        const clone = this.clone();
        clone.query.setIdToFind(id);
        return clone.getHttpClient()
            .get(this.baseUrl + clone.getQuery().toString())
            .then((response) => {
            return new SingularResponse_1.SingularResponse(clone.getQuery(), response, this.modelType, response.getData());
        }, function (response) {
            throw new Error(response.message);
        });
    }
    where(attribute, value) {
        const clone = this.clone();
        clone.getQuery().addFilter(new FilterSpec_1.FilterSpec(attribute, value));
        return clone;
    }
    with(value) {
        const clone = this.clone();
        if (typeof value === 'string') {
            clone.getQuery().addInclude(value);
        }
        else if (Array.isArray(value)) {
            for (let v of value) {
                clone.getQuery().addInclude(v);
            }
        }
        else {
            throw new Error("The argument for 'with' must be a string or an array of strings.");
        }
        return clone;
    }
    orderBy(attribute, direction) {
        if (typeof direction === 'undefined' || direction === null) {
            direction = SortDirection_1.SortDirection.ASC;
        }
        else if (typeof direction === 'string') {
            if (direction === 'asc') {
                direction = SortDirection_1.SortDirection.ASC;
            }
            else if (direction === 'desc') {
                direction = SortDirection_1.SortDirection.DESC;
            }
            else {
                throw new Error("The 'direction' parameter must be string of value 'asc' or 'desc', " +
                    "value '" + direction + "' invalid.");
            }
        }
        const clone = this.clone();
        clone.getQuery().addSort(new SortSpec_1.SortSpec(attribute, direction === SortDirection_1.SortDirection.ASC));
        return clone;
    }
    option(queryParameter, value) {
        const clone = this.clone();
        clone.getQuery().addOption(new Option_1.Option(queryParameter, value));
        return clone;
    }
    clone() {
        let clone = Object.create(this);
        let query = new Query_1.Query(this.query.getJsonApiType(), this.query.getQueriedRelationName(), this.query.getJsonApiId());
        this.query.getFilters().forEach(filter => query.addFilter(filter));
        this.query.getOptions().forEach(option => query.addOption(option));
        this.query.getSort().forEach(sort => query.addSort(sort));
        this.query.getInclude().forEach(include => query.addInclude(include));
        query.setPaginationSpec(Object.create(this.query.getPaginationSpec()));
        const limit = this.query.getLimit();
        if (limit !== undefined) {
            query.setLimit(limit);
        }
        clone.setQuery(query);
        return clone;
    }
    getQuery() {
        return this.query;
    }
    setQuery(query) {
        this.query = query;
    }
    initPaginationSpec() {
        let paginationStrategy = this.modelType.getPaginationStrategy();
        if (paginationStrategy === PaginationStrategy_1.PaginationStrategy.OffsetBased) {
            this.query.setPaginationSpec(new OffsetBasedPaginationSpec_1.OffsetBasedPaginationSpec(this.modelType.getPaginationOffsetParamName(), this.modelType.getPaginationLimitParamName(), this.modelType.getPageSize()));
        }
        else if (paginationStrategy === PaginationStrategy_1.PaginationStrategy.PageBased) {
            this.query.setPaginationSpec(new PageBasedPaginationSpec_1.PageBasedPaginationSpec(this.modelType.getPaginationPageNumberParamName(), this.modelType.getPaginationPageSizeParamName(), this.modelType.getPageSize()));
        }
        else {
            throw new Error('Illegal state: Pagination strategy is not set.');
        }
    }
    getHttpClient() {
        return this.httpClient;
    }
}
exports.Builder = Builder;
//# sourceMappingURL=Builder.js.map