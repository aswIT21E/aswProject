import { Schema, model } from "mongoose";

import type { IComment } from "./comment.interface";

const CommentSchema = new Schema({
  author: { required: true, type: String },
  numberIssue: { required: true, type: Number },
  content: { required: true, type: String },
  date: { required: true, type: String },
});

const CommentModel = model<IComment>("Comment", CommentSchema);

export { CommentModel };
