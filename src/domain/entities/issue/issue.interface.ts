import type { IComment, IUser } from '~/domain/entities';

export interface IIssue {
  id: string;
  numberIssue: number;
  subject: string;
  description: string;
  creator: string; // FK a IUser
  status: string;
  type: string;
  severity: string;
  priority: string;
  comments?: IComment[];
  locked: boolean;
  watchers: IUser[];

  lockIssue: () => void;
  unlockIssue: () => void;
  updateWatchers: (watchers: IUser[]) => void;
  readonly watchersIds: string[];
  asignedTo?: string;
  
}
