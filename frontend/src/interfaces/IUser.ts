import {IStatistic} from "@/interfaces/IStatistic";

interface IUser {
    _id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    blockUser: boolean;
}

interface IUsersResponseApi {
    lastLogin: string;
    rowNumber: number;
    _id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    blockUser: boolean;
}

interface IUsersWithStatistic {
    statistic: IStatistic;
    lastLogin: string;
    rowNumber: number;
    _id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    blockUser: boolean;
}

export type {IUser, IUsersWithStatistic, IUsersResponseApi};