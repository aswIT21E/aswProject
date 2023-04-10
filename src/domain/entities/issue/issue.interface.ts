import type { IComment, IUser } from '~/domain/entities';

export interface IIssue {
  id: string;
  numberIssue: number;
  subject: string;
  description: string;
  creator: IUser; // FK a IUser
  status: string;
  type: string;
  severity: string;
  priority: string;
  comments?: IComment[];
  locked: boolean;
  watchers: IUser[];
  asignedTo?: string;
  lockIssue: () => void;
  unlockIssue: () => void;
  updateWatchers: (watchers: IUser[]) => void;
  readonly watchersIds: string[];
  
  
}
