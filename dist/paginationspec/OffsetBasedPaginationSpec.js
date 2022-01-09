"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PaginationSpec_1 = require("./PaginationSpec");
const QueryParam_1 = require("../QueryParam");
class OffsetBasedPaginationSpec extends PaginationSpec_1.PaginationSpec {
    constructor(pageOffsetParamName, pageLimitParamName, limit) {
        super();
        this.queryParams = [];
        this.pageOffsetParamName = pageOffsetParamName;
        this.pageLimitParamName = pageLimitParamName;
        this.pageLimit = limit;
    }
    getPaginationParameters() {
        this.queryParams = [];
        if (this.pageOffset !== undefined) {
            this.queryParams.push(new QueryParam_1.QueryParam(`${this.pageOffsetParamName}`, this.pageOffset));
            this.queryParams.push(new QueryParam_1.QueryParam(`${this.pageLimitParamName}`, this.pageLimit));
        }
        return this.queryParams;
    }
    setPage(page) {
        page = Math.max(page, 1);
        this.pageOffset = (page - 1) * this.pageLimit;
    }
    setPageLimit(pageLimit) {
        this.pageLimit = pageLimit;
    }
}
exports.OffsetBasedPaginationSpec = OffsetBasedPaginationSpec;
//# sourceMappingURL=OffsetBasedPaginationSpec.js.map