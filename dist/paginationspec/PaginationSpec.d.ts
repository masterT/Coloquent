import { QueryParam } from './../QueryParam';
export declare abstract class PaginationSpec {
    abstract getPaginationParameters(): QueryParam[];
    /**
     * @param page the page number, starting with 1 (0 and 1 both lead to the first page)
     */
    abstract setPage(value: number): any;
    abstract setPageLimit(pageLimit: number): any;
}
