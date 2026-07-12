export interface IComment {
    _id: string;
    comment: string;
    _userId: string;
    userName: string;
    userSurname: string;
    _idOrder: string;
    createdAt: string;
}

export interface ICommentResponse {
    _id: string;
    comment: string;
    _userId: string;
    _idOrder: string;
    createdAt: string;
}
