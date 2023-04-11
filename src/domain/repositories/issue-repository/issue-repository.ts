import type { IActivity } from '~/domain/entities/activity';
import type { IComment } from '~/domain/entities/comment';
import type { IIssue } from '~/domain/entities/issue';
import { Issue } from '~/domain/entities/issue';
import { IssueModel } from '~/domain/entities/issue';

export class IssueRepository {
  public static async addIssue(
    issue: IIssue,
    date: string,
    lastNumberIssue: number,
  ): Promise<IIssue> {
    const newIssue = await IssueModel.create({
      ...issue,
      date,
      comments: [],
      numberIssue: lastNumberIssue + 1,
    });
    return newIssue;
  }

  public static async addActivity(
    issue: IIssue,
    activity: IActivity,
  ): Promise<void> {
    const newActivity = issue.activity;
    newActivity.push(activity);
    await IssueModel.findByIdAndUpdate(issue.id, {
      ...issue,
      activity: newActivity,
    });
  }

  public static async getAllIssues(): Promise<IIssue[]> {
    const issueDocument = await IssueModel.find().populate({
      path: 'creator',
      model: 'User',
    });
    return issueDocument;
  }

  public static async deleteIssue(numberIssue: string): Promise<void> {
    await IssueModel.findByIdAndDelete(numberIssue);
  }

  public static async getIssueById(issueID: string): Promise<IIssue> {
    const issueDocument = await IssueModel.findById(issueID)
      .populate({
        path: 'creator',
        model: 'User',
      })
      .populate({ path: 'watchers', model: 'User' })
      .populate({ path: 'activity', model: 'Activity' });
    const issue = new Issue(issueDocument);
    return issue;
  }
  public static async getIssueByType(issueType: string) {
    return await IssueModel.find({ type: issueType });
  }
  public static async getIssueByT(issueType: string) {
    return await IssueModel.find({ type: issueType });
  }

  public static async getLastIssue(): Promise<number> {
    const maxNumber = await IssueModel.aggregate([
      { $group: { _id: null, maxNumber: { $max: '$numberIssue' } } },
    ]).exec();
    if (maxNumber.length > 0) {
      return maxNumber[0].maxNumber;
    } else {
      return 0;
    }
  }

  public static async addComment(
    issueID: string,
    comment: IComment,
  ): Promise<IIssue> {
    const issue = await IssueModel.findById(issueID);
    issue.comments.push(comment);
    const updatedIssue = await issue.save();
    return updatedIssue;
  }

  public static async modifyParameterIssue(
    numberIssue: string,
    parameter: string,
    newValue: string,
  ): Promise<IIssue> {
    const modifiedIssue = await IssueModel.findByIdAndUpdate(
      { _id: numberIssue },
      { [parameter]: newValue },
      { new: true },
    );
    return modifiedIssue;
  }

  public static async updateIssue(newIssue: IIssue): Promise<IIssue> {
    const activity = newIssue.activitiesIds;
    const watchers = newIssue.watchersIds;

    await IssueModel.findByIdAndUpdate(newIssue.id, {
      ...newIssue,
      watchers,
      activity,
    });

    return newIssue;
  }
}
