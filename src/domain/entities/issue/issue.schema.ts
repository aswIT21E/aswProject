import { Schema, model } from "mongoose";

import type { IIssue } from "./issue.interface";

const IssueSchema = new Schema({
  subject: { required: true, type: String },
  numberIssue: { required: true, type: Number },
  description: { required: true, type: String },
  creator: { required: true, type: String }, // FK a IUser
  status: { required: true, type: String },
  type: { required: true, type: String },
  severity: { required: true, type: String },
  priority: { required: true, type: String },
});

const IssueModel = model<IIssue>("Issue", IssueSchema);

export { IssueModel };
