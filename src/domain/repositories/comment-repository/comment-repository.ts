import type { IComment } from "~/domain/entities/comment";
import { CommentModel } from "~/domain/entities/comment";

export class CommentRepository {
  public static async addComment(
    content: string,
    numberIssue: string,
    date: string,
    author: string
  ): Promise<IComment> {
    const newComment = new CommentModel({
      content: content,
      numberIssue: numberIssue,
      date: date,
      author: author,
    });
    await newComment.save();
    const comment: IComment = {
      _id: newComment._id.toString(),
      numberIssue: newComment.numberIssue,
      content: newComment.content,
      author: newComment.author,
      date: newComment.date,
    };
    return comment;
  }
  public static async getComment(message: IComment): Promise<IComment> {
    return await CommentModel.findById(message);
  }

  public static async getAllComments(): Promise<IComment[]> {
    return await CommentModel.find();
  }
}
