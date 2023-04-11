import type { MongoId } from '~/types/types';

import type { IUser } from '../user';

import type { IActivity } from './activity.interface';

export class Activity implements IActivity {
  public actor: IUser;
  public message: string;
  public id: MongoId;

  constructor(id: MongoId, actor: IUser, message: string) {
    this.actor = actor;
    this.message = message;
    this.id = id;
  }
}
