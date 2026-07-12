interface IPaginatedResponseOrder <T>{
    totalItems: number;
    totalPages: number;
    prevPage: boolean;
    nextPage: boolean;
    data: T[];
}

interface IOrder {
    rowNumber: number
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number;
    already_paid: number;
    utm: string;
    msg: string;
    status: string;
    group: string;
    manager: string;
    managerInfo?: string;
    created_at: string;
    updatedAt: string;
}

interface IOrderPromise {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number;
    already_paid: number;
    utm: string;
    msg: string;
    status: string;
    group: string;
    manager: string;
    managerInfo?: string;
    created_at: string;
    updatedAt: string;
}


export type {IOrder, IPaginatedResponseOrder,IOrderPromise};