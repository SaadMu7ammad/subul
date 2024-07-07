export type GetAllCasesQueryParams = {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  mainType?: string;
  freezed?: boolean;
  subType?: string;
  nestedSubType?: string;
  finished?: boolean;
};

export type FilterQueryParams = Pick<
  GetAllCasesQueryParams,
  'mainType' | 'subType' | 'nestedSubType' | 'freezed' | 'finished'
>;
export type FilterObj = FilterQueryParams & { charity?: string };
export type SortObj = { [key: string]: 1 | -1 };
export type PaginationObj = { page: number; limit: number };
