import { Schema, model } from 'mongoose';

import type { IComment } from './comment.interface';

const CommentSchema = new Schema({
  author: { required: true, type: Schema.Types.ObjectId, model: 'User' },
  content: { required: true, type: String },
  date: { required: false, type: String },
});

const CommentModel = model<IComment>('Comment', CommentSchema);

export { CommentModel };
