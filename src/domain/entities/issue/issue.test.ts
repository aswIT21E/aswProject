import { Issue } from "./issue";
import type { IIssue } from "./issue.interface";

describe("Issue Entity", function () {
  let instance: IIssue;

  beforeEach(function () {
    instance = new Issue(
      "test-id",
      "test-subject",
      "test-description",
      "test-creator"
    );
  });

  it("can be created", function () {
    expect(instance).toMatchSnapshot();
  });
});