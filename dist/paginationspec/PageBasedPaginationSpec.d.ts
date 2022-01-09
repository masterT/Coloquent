import { PaginationSpec } from "./PaginationSpec";
import { QueryParam } from './../QueryParam';
export declare class PageBasedPaginationSpec extends PaginationSpec {
    protected pageNumberParamName: string;
    protected pageSizeParamName: string;
    protected pageLimit: number;
    protected pageNumber: number;
    private queryParams;
    constructor(pageNumberParamName: string, pageSizeParamName: string, pageLimit: number);
    getPaginationParameters(): QueryParam[];
    setPage(page: number): void;
    setPageLimit(pageLimit: number): void;
}
