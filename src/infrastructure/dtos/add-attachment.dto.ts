import { IsNotEmpty } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

export class AddAttachmentDto {
  @IsNotEmpty()
  file: any;
}

export async function addAttachmentDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new AddAttachmentDto();
  DTO.file = req.files.file;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
