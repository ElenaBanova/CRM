import { IGroup, IGroupCreate } from "../interfaces/group.interface";
import { Group } from "../models/group.model";

class GroupRepository {
  public getAll(): Promise<IGroup[]> {
    return Group.find();
  }
  public create(group: IGroupCreate): Promise<IGroup> {
    return Group.create(group);
  }

  public getById(id: string): Promise<IGroup> {
    return Group.findById(id);
  }
}

export const groupRepository = new GroupRepository();
