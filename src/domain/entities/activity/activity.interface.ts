import type { MongoId } from '~/types/types';

import type { IUser } from '../user';

export interface IActivity {
  id: MongoId;
  actor: IUser;
  message: string;
}
