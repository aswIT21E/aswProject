import type { MongoId } from '~/types/types';

import type { IUser } from './user.interface';

export class User implements IUser {
  public id: MongoId;
  public email: string;
  public name: string;
  public username: string;
  public password: string;
  public bio: string;

  constructor(id: MongoId, email: string, name: string, username: string, password: string, bio: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.username = username;
    this.password = password;
    this.bio = bio;
  }
}
