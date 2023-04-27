import { IsNotEmpty } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

class RemoveAttachmentDto {
  @IsNotEmpty()
  attachmentIndex: number;
}

export async function removeAttachmentDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new RemoveAttachmentDto();
  DTO.attachmentIndex = req.body.attachmentIndex;
  console.log(DTO);
  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
