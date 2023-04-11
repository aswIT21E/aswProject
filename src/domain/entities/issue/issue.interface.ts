import type { IComment, IUser } from '~/domain/entities';

import type { Activity } from '../activity';

export interface IIssue {
  id: string;
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
  readonly watchersIds: string[];
}
