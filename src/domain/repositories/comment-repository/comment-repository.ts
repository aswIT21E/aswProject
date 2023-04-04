import type { IComment } from "~/domain/entities/comment";
import { CommentModel } from "~/domain/entities/comment";
import { Comment } from '~/domain/entities/comment';

export class IssueRepository {
    public static async addComment(content: string, numberIssue: number, date: Date, author: string): Promise<IComment> {
        const document = await CommentModel.create({
          content: content,
          author: author,
          date: date,
          numberIssue: numberIssue,
        });
        const object = document.toObject();
        return new Comment(
          object.id,
          object.numberIssue,
          object.content,
          object.author,
        );
      }
      public static async getMessage(message: string): Promise<IComment> {
        return await CommentModel.findById(message);
      }
}