import { IsNotEmpty, IsDate } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

export class UpdateDeadlineDto {
  @IsDate()
  @IsNotEmpty()
  deadline: Date;
}

export async function updateDeadlineDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new UpdateDeadlineDto();
  DTO.deadline = new Date(req.body.deadline);

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(401).json({ errors , message: 'Invalid data'});
    return;
  }

  next();
}
