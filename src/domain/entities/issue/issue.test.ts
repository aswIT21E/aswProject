import { User } from '../user';

import { Issue } from './issue';
import type { IIssue } from './issue.interface';

describe('Issue Entity', function () {
  let instance: IIssue;

  beforeEach(function () {
    instance = new Issue(
      'test-id',
      1234,
      'test-subject',
      'test-description',
      new User('test-id', 'test-email', 'test-username', 'test-password'),
      'done',
      'bug',
      '2/2/2002',
      'high',
      'high',
      [],
    );
  });

  it('can be created', function () {
    expect(instance).toMatchSnapshot();
  });

  it('locksIssue sets locked property as true', function () {
    instance.lockIssue();

    expect(instance.locked).toBeTruthy();
  });

  it('unlocksIssue sets locked property as false', function () {
    instance.unlockIssue();

    expect(instance.locked).toBeFalsy();
  });
});
