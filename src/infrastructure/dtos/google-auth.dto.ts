import { IsString, IsNotEmpty } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  credentials: string;
}

export async function googleAuthDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new GoogleAuthDto();
  DTO.credentials = req.body.credentials;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
