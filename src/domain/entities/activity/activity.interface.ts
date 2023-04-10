import { MongoId } from '~/types/types';
import { IUser } from '../user';

export interface IActivity {
  id: MongoId;
  actor: IUser;
  message: string;
}
