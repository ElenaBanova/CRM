import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import { IGroup, IGroupCreate } from "../interfaces/group.interface";
import { groupRepository } from "../repositories/group.repository";

class GroupService {
  public getAll(): Promise<IGroup[]> {
    return groupRepository.getAll();
  }

  public create(group: IGroupCreate): Promise<IGroup> {
    return groupRepository.create(group);
  }

  public async getBySelectValue(value: Partial<IGroup>): Promise<IGroup> {
    const group = await groupRepository.getBySelectValue(value);

    if (!group) {
      throw new ApiError("Group not found", StatusCodesEnum.NOT_FOUND);
    }

    return group;
  }
}

export const groupService = new GroupService();
