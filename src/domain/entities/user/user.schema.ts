import { Schema, model } from 'mongoose';

import type { IUser } from './user.interface';

const UserSchema = new Schema({
  email: { required: true, type: String },
  name: { required: true, type: String },
  username: { required: true, type: String },
  password: { required: false, type: String },
  bio: { required: false, type: String },
  profilePicture: { required: true, type: String },
});

const UserModel = model<IUser>('User', UserSchema);

export { UserModel };
