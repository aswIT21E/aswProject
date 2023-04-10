import { IsString, IsNotEmpty } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

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

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  severity: string;

  @IsString()
  @IsNotEmpty()
  priority: string;
  
}

export async function createIssueDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new CreateIssueDto();
  DTO.subject = req.body.subject;
  DTO.description = req.body.description;
  DTO.creator = req.body.creator;
  DTO.status = req.body.status;
  DTO.type = req.body.type;
  DTO.severity = req.body.severity;
  DTO.priority = req.body.priority;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
