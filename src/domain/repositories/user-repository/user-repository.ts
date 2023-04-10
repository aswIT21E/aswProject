import type { IUser } from '~/domain/entities/user';
import { User } from '~/domain/entities/user';
import { UserModel } from '~/domain/entities/user';

export class UserRepository {
  public static async addUser(user: IUser): Promise<void> {
    await UserModel.create(user);
  }

  public static async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  public static async getUserById(userId: string): Promise<IUser> {
    const userDocument = await UserModel.findById(userId);
    if (!userDocument) {
      return null;
    }

    const user = new User(
      userDocument.id,
      userDocument.email,
      userDocument.username,
    );

    return user;
  }
}
