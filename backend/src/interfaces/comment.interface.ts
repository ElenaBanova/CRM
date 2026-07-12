import { IBase } from "./base.interface";

interface IComment extends IBase {
  _id: string;
  comment: string;
  _userId: string;
  _idOrder: string;
}

type ICommentCreate = Pick<IComment, "comment" | "_userId" | "_idOrder">;

interface ICommentAggregate {
  _id: string;
  comment: string;
  userName: string;
  userSurname: string;
  _idOrder: string;
  createdAt: Date;
}

type ICommentNew = Pick<IComment, "comment">;

export { IComment, ICommentAggregate, ICommentCreate, ICommentNew };
