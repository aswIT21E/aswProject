import type { IComment, IUser } from '~/domain/entities';
import type { MongoId } from '~/types/types';

import type { Activity, IActivity } from '../activity';

export interface IIssue {
  id?: MongoId;
  numberIssue: number;
  subject: string;
  description: string;
  activity?: Activity[];
  creator: IUser; // FK a IUser
  status: string;
  severity: string;
  type: string;
  date: string;
  priority: string;
  comments?: IComment[];
  locked?: boolean;
  reasonLock?: string;
  watchers?: IUser[];
  assignedTo?: IUser;
  attachments?: string[];
  deadline?: Date;

  lockIssue: (reason: String) => void;
  unlockIssue: () => void;
  updateWatchers: (watchers: IUser[]) => void;
  addActivity: (activity: IActivity) => void;
  addAttachment: (attachment: string) => void;
  assignUser: (user: IUser) => void;
  removeAttachment: (index: number) => void;
  updateDeadline: (deadline: Date) => void;
  removeDeadline: () => void;

  readonly watchersIds: MongoId[];
  readonly activitiesIds: MongoId[];
}
