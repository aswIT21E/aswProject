import type { IIssue } from "~/domain/entities/issue";
import { IssueModel } from "~/domain/entities/issue";

export class IssueRepository {
  public static async addIssue(issue: IIssue, lastNumberIssue: number): Promise<void> {
    const newIssue = new IssueModel({ ...issue, numberIssue: lastNumberIssue + 1 });
    await newIssue.save();
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
}
