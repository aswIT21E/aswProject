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
      'test-creator',
      'done',
      'bug',
      'high',
      'high',
      [],
    );
  });

  it('can be created', function () {
    expect(instance).toMatchSnapshot();
  });
});
