import { IBase } from "./base.interface";

interface IGroup extends IBase {
  _id: string;
  name: string;
}

type IGroupCreate = Pick<IGroup, "name">;

export { IGroup, IGroupCreate };
