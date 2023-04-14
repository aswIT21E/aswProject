import { validate, ValidateNested } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

import type { CreateIssueDto } from './create-issue.dto';

export class BulkIssuesDto {
  @ValidateNested({ each: true })
  issues: CreateIssueDto[];
}

export async function bulkIssuesDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new BulkIssuesDto();
  DTO.issues = req.body.issues;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
