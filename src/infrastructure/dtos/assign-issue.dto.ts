import { IsString, IsNotEmpty } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

class AssignIssueDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export async function assignIssueDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new AssignIssueDto();
  DTO.userId = req.body.userId;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
