import { Schema, model } from "mongoose";

import type { IIssue } from "./issue.interface";

const IssueSchema = new Schema({
  subject: { required: true, type: String },
  description: { required: true, type: String },
  creator: { required: true, type: String }, // FK a IUser
});

const IssueModel = model<IIssue>("Issue", IssueSchema);

export { IssueModel };
