import { Types } from 'mongoose';

import { User } from './user';
import type { IUser } from './user.interface';

describe('User Entity', function () {
  let instance: IUser;

  beforeEach(function () {
    instance = new User(
      new Types.ObjectId(),
      'test-email',
      'test-name',
      'test-username',
      'test-password',
      'test-bio',
    );
  });

  it('can be created', function () {
    expect(instance).toMatchSnapshot();
  });
});
