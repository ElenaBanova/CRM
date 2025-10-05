import { IGroup, IGroupCreate } from "../interfaces/group.interface";
import { groupRepository } from "../repositories/group.repository";

class GroupService {
  public getAll(): Promise<IGroup[]> {
    return groupRepository.getAll();
  }

  public create(group: IGroupCreate): Promise<IGroup> {
    return groupRepository.create(group);
  }

  public getById(id: string): Promise<IGroup> {
    return groupRepository.getById(id);
  }
}

export const groupService = new GroupService();
