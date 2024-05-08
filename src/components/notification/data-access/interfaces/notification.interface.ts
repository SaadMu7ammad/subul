export type SortObject = {
  [key: string]: 1 | -1;
};

export type GetAllNotificationsQueryParams = {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
};


