import { IStatistic } from "./user.interface";

export interface IPaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  prevPage: boolean;
  nextPage: boolean;
  data: T[];
}

export interface IPaginatedUsersResponse<T> extends IPaginatedResponse<T> {
  totalStatistic: IStatistic;
}
