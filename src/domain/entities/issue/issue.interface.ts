import type { IComment, IUser } from '~/domain/entities';
import { MongoId } from '~/types/types';

import type { Activity, IActivity } from '../activity';

export interface IIssue {
  id: MongoId;
  numberIssue: number;
  subject: string;
  description: string;
  activity: Activity[];
  creator: IUser; // FK a IUser
  status: string;
  severity: string;
  type: string;
  date: string;
  priority: string;
  comments?: IComment[];
  locked: boolean;
  watchers: IUser[];

  lockIssue: () => void;
  unlockIssue: () => void;
  updateWatchers: (watchers: IUser[]) => void;
  addActivity: (activity: IActivity) => void;
  readonly watchersIds: MongoId[];
  readonly activitiesIds: MongoId[];
}
