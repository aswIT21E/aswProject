import { MongoId } from '~/types/types';
import { IUser } from '../user';
import { IActivity } from './activity.interface';

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
