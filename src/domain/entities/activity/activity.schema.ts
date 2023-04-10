import { Schema, model } from 'mongoose';

import type { IActivity } from './activity.interface';

const ActivitySchema = new Schema({
  message: { required: true, type: String },
  actor: { required: true, type: Schema.Types.ObjectId, model: 'User' },
});

const ActivityModel = model<IActivity>('Issue', ActivitySchema);

export { ActivityModel };
