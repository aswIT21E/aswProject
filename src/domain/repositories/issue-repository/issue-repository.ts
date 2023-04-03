import { IComment } from "~/domain/entities/comment";
import type { IIssue } from "~/domain/entities/issue";
import { IssueModel } from "~/domain/entities/issue";

export class IssueRepository {
  public static async addIssue(issue: IIssue, lastNumberIssue: number): Promise<IIssue> {
    const date = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    const newIssue = new IssueModel({ ...issue, numberIssue: lastNumberIssue + 1, date: date, comments: []});
    await newIssue.save();
    return newIssue;
  }

  public static async getAllIssues(): Promise<IIssue[]> {
    return await IssueModel.find();
  }

  public static async getIssueById(issueID: string): Promise<IIssue> {
    return await IssueModel.findById(issueID); 
  }
  public static async getLastIssue(): Promise<number>{
    const maxNumber = await IssueModel.aggregate([
      { $group: { _id: null, maxNumber: { $max: "$numberIssue" } } }
    ]).exec();
    if (maxNumber.length > 0) {
      return maxNumber[0].maxNumber;
    } else {
      return 0;
    }
  }
  public static async addComment(issueID: string, comment: IComment): Promise<IIssue>{
    const issue = await IssueModel.findById(issueID);
    console.log(issue);
    issue.comments.push(comment);
    const updatedIssue = await issue.save();
    return updatedIssue;
  }
}
