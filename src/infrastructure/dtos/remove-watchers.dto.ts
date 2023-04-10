import { IsNotEmpty, IsArray } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

class RemoveWatchersDto {
  @IsArray()
  @IsNotEmpty()
  users: string[];
}

export async function removeWatchersDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new RemoveWatchersDto();
  DTO.users = req.body.users;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
