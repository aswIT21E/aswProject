import { Types } from 'mongoose';

import { User } from '../user';

import { Issue } from './issue';
import type { IIssue } from './issue.interface';

describe('Issue Entity', function () {
  let instance: IIssue;

  beforeEach(function () {
    instance = new Issue({
      id: new Types.ObjectId(),
      numberIssue: 1234,
      subject: 'test-subject',
      description: 'test-description',
      creator: new User(
        new Types.ObjectId(),
        'test-email',
        'test-name',
        'test-username',
        'test-password',
        'test-bio',
      ),
      status: 'done',
      type: 'bug',
      date: '2/2/2002',
      priority: 'high',
      severity: 'high',
      activity: [],
      locked: false,
      watchers: [],
    });
  });

  it('can be created', function () {
    expect(instance).toMatchSnapshot();
  });

  it('locksIssue sets locked property as true', function () {
    instance.lockIssue("test");

    expect(instance.locked).toBeTruthy();
  });

  it('unlocksIssue sets locked property as false', function () {
    instance.unlockIssue();

    expect(instance.locked).toBeFalsy();
  });
});
