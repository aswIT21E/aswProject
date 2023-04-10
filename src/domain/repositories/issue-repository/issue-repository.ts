import type { IComment } from '~/domain/entities/comment';
import type { IIssue } from '~/domain/entities/issue';
import { Issue } from '~/domain/entities/issue';
import { IssueModel } from '~/domain/entities/issue';

export class IssueRepository {
  public static async addIssue(
    issue: IIssue,
    lastNumberIssue: number,
  ): Promise<IIssue> {
    const date = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
    });

    const newIssue = await IssueModel.create({
      ...issue,
      date,
      comments: [],
      numberIssue: lastNumberIssue + 1,
    });
    return newIssue;
  }

  public static async getAllIssues(): Promise<IIssue[]> {
    return await IssueModel.find();
  }

  public static async getIssueById(issueID: string): Promise<IIssue> {
    const issueDocument = await (
      await IssueModel.findById(issueID).populate({
        path: 'creator',
        model: 'User',
      })
    ).populate({ path: 'watchers', model: 'User' });

    const issue = new Issue(
      issueDocument.id,
      issueDocument.numberIssue,
      issueDocument.subject,
      issueDocument.description,
      issueDocument.creator,
      issueDocument.status,
      issueDocument.type,
      issueDocument.severity,
      issueDocument.priority,
      issueDocument.comments,
      issueDocument.watchers,
    );

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
    await IssueModel.findByIdAndUpdate(newIssue.id, newIssue);
    return newIssue;
  }
}
