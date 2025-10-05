import { IUser, IUserDTO } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public getAll(): Promise<IUser[]> {
    return User.find();
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

  public deleteById(id: string): Promise<void> {
    return User.findByIdAndDelete(id);
  }

  public getByEmail(email: string): Promise<IUser> {
    return User.findOne({ email });
  }
}

export const userRepository = new UserRepository();
