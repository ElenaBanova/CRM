import { IUser, IUserDTO, IUserWithIndex } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUserWithIndex[]> {
    const baseUsedIds = await User.find({})
      .sort({ _id: 1 })
      .select("_id")
      .lean();

    const idToRowNumberMap = new Map<string, number>();
    baseUsedIds.forEach((user, index) => {
      idToRowNumberMap.set(user._id.toString(), index + 1);
    });

    const users = await User.find().select("-password").sort("-_id").lean();

    return users.map((user) => ({
      ...user,
      rowNumber: idToRowNumberMap.get(user._id.toString()),
    }));
  }

  public create(user: IUserDTO): Promise<IUser> {
    return User.create(user);
  }

  public getById(id: string): Promise<IUser> {
    return User.findById(id);
  }

  public updateById(id: string, user: Partial<IUser>): Promise<IUser> {
    return User.findByIdAndUpdate(id, user, { new: true });
  }

  public getByEmail(email: string): Promise<IUser> {
    return User.findOne({ email });
  }
}

export const userRepository = new UserRepository();
