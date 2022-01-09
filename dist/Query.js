"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassFilterSpec_1 = require("./ClassFilterSpec");
const QueryParam_1 = require("./QueryParam");
class Query {
    constructor(jsonApiType, queriedRelationName = undefined, jsonApiId = undefined) {
        this.jsonApiType = jsonApiType;
        this.jsonApiId = jsonApiId;
        this.queriedRelationName = queriedRelationName;
        this.include = [];
        this.filters = [];
        this.options = [];
        this.sort = [];
    }
    addFilterParameters(searchParams) {
        for (let f of this.filters) {
            if (f instanceof ClassFilterSpec_1.ClassFilterSpec) {
                let ff = f;
                searchParams.push(new QueryParam_1.QueryParam(`filter[${ff.getClass()}][${ff.getAttribute()}]`, ff.getValue()));
            }
            else {
                searchParams.push(new QueryParam_1.QueryParam(`filter[${f.getAttribute()}]`, f.getValue()));
            }
        }
    }
    addIncludeParameters(searchParams) {
        if (this.include.length > 0) {
            let p = '';
            for (let incl of this.include) {
                if (p !== '') {
                    p += ',';
                }
                p += incl;
            }
            searchParams.push(new QueryParam_1.QueryParam('include', p));
        }
    }
    addOptionsParameters(searchParams) {
        for (let option of this.options) {
            searchParams.push(new QueryParam_1.QueryParam(option.getParameter(), option.getValue()));
        }
    }
    addPaginationParameters(searchParams) {
        for (let param of this.paginationSpec.getPaginationParameters()) {
            searchParams.push(new QueryParam_1.QueryParam(param.name, param.value));
        }
    }
    addSortParameters(searchParams) {
        if (this.sort.length > 0) {
            let p = '';
            for (let sortSpec of this.sort) {
                if (p !== '') {
                    p += ',';
                }
                if (!sortSpec.getPositiveDirection()) {
                    p += '-';
                }
                p += sortSpec.getAttribute();
            }
            searchParams.push(new QueryParam_1.QueryParam('sort', p));
        }
    }
    toString() {
        let relationToFind = '';
        if (!this.jsonApiId) {
            relationToFind = this.queriedRelationName
                ? '/' + this.queriedRelationName
                : '';
        }
        else {
            relationToFind = this.queriedRelationName
                ? '/' + this.jsonApiId + '/' + this.queriedRelationName
                : '';
        }
        let idToFind = this.idToFind
            ? '/' + this.idToFind
            : '';
        let searchParams = [];
        this.addFilterParameters(searchParams);
        this.addIncludeParameters(searchParams);
        this.addOptionsParameters(searchParams);
        this.addPaginationParameters(searchParams);
        this.addSortParameters(searchParams);
        let paramString = '';
        for (let searchParam of searchParams) {
            if (paramString === '') {
                paramString += '?';
            }
            else {
                paramString += '&';
            }
            paramString += encodeURIComponent(searchParam.name) + '=' + encodeURIComponent(searchParam.value);
        }
        return this.jsonApiType + relationToFind + idToFind + paramString;
    }
    getJsonApiType() {
        return this.jsonApiType;
    }
    getJsonApiId() {
        return this.jsonApiId;
    }
    getQueriedRelationName() {
        return this.queriedRelationName;
    }
    setIdToFind(idToFind) {
        this.idToFind = idToFind;
    }
    getPaginationSpec() {
        return this.paginationSpec;
    }
    setPaginationSpec(paginationSpec) {
        this.paginationSpec = paginationSpec;
    }
    addInclude(includeSpec) {
        this.include.push(includeSpec);
    }
    getInclude() {
        return this.include;
    }
    addFilter(filter) {
        this.filters.push(filter);
    }
    getFilters() {
        return this.filters;
    }
    addSort(sort) {
        this.sort.push(sort);
    }
    getSort() {
        return this.sort;
    }
    addOption(option) {
        this.options.push(option);
    }
    getOptions() {
        return this.options;
    }
    setLimit(limit) {
        this.limit = limit;
    }
    getLimit() {
        return this.limit;
    }
    /**
     * Example: When including 'foo.bar, goo', then the include paths are [[foo, bar], [goo]].
     */
    get includePaths() {
        return this
            .include
            .map(includePath => includePath.split('.'));
    }
    /**
     * Example: When including 'foo.bar, goo', then the include tree is {foo: {bar: true}, goo: true}.
     */
    get includeTree() {
        const tree = {};
        for (let path of this.includePaths) {
            this.includeTreeRecurse(tree, path);
        }
        return tree;
    }
    includeTreeRecurse(tree, path) {
        if (path.length === 1) {
            tree[path[0]] = {};
        }
        else if (path.length > 1) {
            const subtree = {};
            tree[path[0]] = subtree;
            this.includeTreeRecurse(subtree, path.slice(1));
        }
    }
}
exports.Query = Query;
//# sourceMappingURL=Query.js.map