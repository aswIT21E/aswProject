import type { IIssue } from "~/domain/entities/issue";
import { IssueModel } from "~/domain/entities/issue";

export class IssueRepository {
  public static async addIssue(issue: IIssue): Promise<void> {
    await IssueModel.create(issue);
  }

  public static async getAllIssues(): Promise<IIssue[]> {
    return await IssueModel.find();
  }

  public static async getIssueById(issueID: string): Promise<IIssue> {
    return await IssueModel.findById(issueID); 
  }
}
