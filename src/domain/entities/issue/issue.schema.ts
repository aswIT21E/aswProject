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
  attachments: [{ required: true, type: String }],
  locked: { required: true, type: Boolean, default: false },
  reasonLock: { required: false, type: String },
  watchers: [{ required: true, type: Schema.Types.ObjectId, model: 'User' }],
  assignedTo: { required: false, type: Schema.Types.ObjectId, model: 'User' },
  tags: { required: false, type: [String] },
  deadline: { required: false, type: Date },
});

const IssueModel = model<IIssue>('Issue', IssueSchema);

export { IssueModel };
