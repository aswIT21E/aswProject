import { Schema, model } from 'mongoose';

import type { IIssue } from './issue.interface';

const IssueSchema = new Schema({
  subject: { required: true, type: String },
  numberIssue: { required: true, type: Number },
  description: { required: true, type: String },
  activity: [
    { required: true, type: Schema.Types.ObjectId, model: 'Activity' },
  ],
  creator: { required: true, type: Schema.Types.ObjectId, model: 'User' }, // FK a IUser
  status: { required: true, type: String },
  severity: { required: true, type: String },
  type: { required: true, type: String },
  date: { required: false, type: String },
  priority: { required: true, type: String },
  comments: [{ required: true, type: Schema.Types.ObjectId, model: 'Comment' }],
  locked: { required: true, type: Boolean, default: false },
  watchers: [{ required: true, type: Schema.Types.ObjectId, model: 'User' }],
  asigned_to: { required: false, type: String },
  tags: { required: false, type: [String] },
});

const IssueModel = model<IIssue>('Issue', IssueSchema);

export { IssueModel };
