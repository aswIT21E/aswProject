export interface IIssue {
  id: string;
  subject: string;
  description: string;
  creator: string; // FK a IUser
}
