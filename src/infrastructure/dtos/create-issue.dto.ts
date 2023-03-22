import { IsString, IsNotEmpty } from "class-validator";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";

class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  creator: string; // FK a IUser
}

export async function createIssueDto(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const DTO = new CreateIssueDto();
  DTO.subject = req.body.subject;
  DTO.description = req.body.description;
  DTO.creator = req.body.creator;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
