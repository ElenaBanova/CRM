import { IBase } from "./base.interface";

interface IComment extends IBase {
  _id: string;
  comment: string;
  _userId: string;
  _idApplication: string;
}

type ICommentCreate = Pick<IComment, "comment" | "_userId" | "_idApplication">;

interface ICommentQuery {
  _idApplication?: string;
}

export { IComment, ICommentCreate, ICommentQuery };
