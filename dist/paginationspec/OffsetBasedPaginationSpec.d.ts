import { PaginationSpec } from "./PaginationSpec";
import { QueryParam } from "../QueryParam";
export declare class OffsetBasedPaginationSpec extends PaginationSpec {
    protected pageOffsetParamName: string;
    protected pageLimitParamName: string;
    protected pageLimit: number;
    protected pageOffset: number;
    private queryParams;
    constructor(pageOffsetParamName: string, pageLimitParamName: string, limit: number);
    getPaginationParameters(): QueryParam[];
    setPage(page: number): void;
    setPageLimit(pageLimit: number): void;
}
