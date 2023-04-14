import type { IUser } from '~/domain/entities/user';
import { User } from '~/domain/entities/user';
import { UserModel } from '~/domain/entities/user';

export class UserRepository {
  public static async addUser(user: IUser): Promise<User> {
    return await UserModel.create({
      ...user,
      profilePicture:
        'https://projecteaws.s3.eu-west-3.amazonaws.com/profile.png',
    });
  }
  public static async editarUser(
    oldUser: IUser,
    newUser: IUser,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(newUser.id, {
      ...newUser,
    });
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
      userDocument.name,
      userDocument.username,
      userDocument.password,
      userDocument.bio,
    );

    return user;
  }

  public static async getUserByUsername(userName: string): Promise<IUser> {
    const userDocument = await UserModel.findOne({ username: userName });

    if (!userDocument) return null;

    const user = new User(
      userDocument.id,
      userDocument.email,
      userDocument.name,
      userDocument.username,
      userDocument.password,
      userDocument.bio,
    );

    return user;
  }

  public static async getUserUsernames(): Promise<string[]> {
    const users: IUser[] = await UserModel.find();
    const uniqueUsernames: string[] = [];

    users.forEach((user) => {
      if (!uniqueUsernames.includes(user.username)) {
        uniqueUsernames.push(user.username);
      }
    });

    return uniqueUsernames;
  }
}
