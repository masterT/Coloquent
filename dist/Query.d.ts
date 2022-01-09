import { FilterSpec } from "./FilterSpec";
import { SortSpec } from "./SortSpec";
import { Option } from "./Option";
import { PaginationSpec } from "./paginationspec/PaginationSpec";
import { QueryParam } from "./QueryParam";
export declare class Query {
    protected jsonApiType: string;
    protected jsonApiId: string | undefined;
    protected queriedRelationName: string | undefined;
    protected idToFind: string | number;
    protected paginationSpec: PaginationSpec;
    protected include: string[];
    protected filters: FilterSpec[];
    protected options: Option[];
    protected sort: SortSpec[];
    protected limit: number | undefined;
    constructor(jsonApiType: string, queriedRelationName?: string | undefined, jsonApiId?: string | undefined);
    protected addFilterParameters(searchParams: QueryParam[]): void;
    protected addIncludeParameters(searchParams: QueryParam[]): void;
    protected addOptionsParameters(searchParams: QueryParam[]): void;
    protected addPaginationParameters(searchParams: QueryParam[]): void;
    protected addSortParameters(searchParams: QueryParam[]): void;
    toString(): string;
    getJsonApiType(): string;
    getJsonApiId(): string | undefined;
    getQueriedRelationName(): string | undefined;
    setIdToFind(idToFind: string | number): void;
    getPaginationSpec(): PaginationSpec;
    setPaginationSpec(paginationSpec: PaginationSpec): void;
    addInclude(includeSpec: string): void;
    getInclude(): string[];
    addFilter(filter: FilterSpec): void;
    getFilters(): FilterSpec[];
    addSort(sort: SortSpec): void;
    getSort(): SortSpec[];
    addOption(option: Option): void;
    getOptions(): Option[];
    setLimit(limit: number): void;
    getLimit(): number | undefined;
    /**
     * Example: When including 'foo.bar, goo', then the include paths are [[foo, bar], [goo]].
     */
    private readonly includePaths;
    /**
     * Example: When including 'foo.bar, goo', then the include tree is {foo: {bar: true}, goo: true}.
     */
    readonly includeTree: any;
    private includeTreeRecurse;
}
