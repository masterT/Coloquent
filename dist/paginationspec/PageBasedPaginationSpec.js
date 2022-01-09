"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PaginationSpec_1 = require("./PaginationSpec");
const QueryParam_1 = require("./../QueryParam");
class PageBasedPaginationSpec extends PaginationSpec_1.PaginationSpec {
    constructor(pageNumberParamName, pageSizeParamName, pageLimit) {
        super();
        this.queryParams = [];
        this.pageNumberParamName = pageNumberParamName;
        this.pageSizeParamName = pageSizeParamName;
        this.pageLimit = pageLimit;
    }
    getPaginationParameters() {
        this.queryParams = [];
        if (this.pageNumber !== undefined) {
            this.queryParams.push(new QueryParam_1.QueryParam(`${this.pageNumberParamName}`, this.pageNumber));
            this.queryParams.push(new QueryParam_1.QueryParam(`${this.pageSizeParamName}`, this.pageLimit));
        }
        return this.queryParams;
    }
    setPage(page) {
        page = Math.max(page, 1);
        this.pageNumber = page;
    }
    setPageLimit(pageLimit) {
        this.pageLimit = pageLimit;
    }
}
exports.PageBasedPaginationSpec = PageBasedPaginationSpec;
//# sourceMappingURL=PageBasedPaginationSpec.js.map