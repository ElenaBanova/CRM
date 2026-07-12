import { IGroup, IGroupCreate } from "../interfaces/group.interface";
import { Group } from "../models/group.model";

class GroupRepository {
  public getAll(): Promise<IGroup[]> {
    return Group.find();
  }
  public create(group: IGroupCreate): Promise<IGroup> {
    return Group.create(group);
  }

  public getBySelectValue(value: Partial<IGroup>): Promise<IGroup> {
    return Group.findOne(value);
  }
}

export const groupRepository = new GroupRepository();
