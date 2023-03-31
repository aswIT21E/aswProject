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
}
