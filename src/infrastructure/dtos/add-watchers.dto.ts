import { IsNotEmpty, IsArray } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

class AddWatchersDto {
  @IsArray()
  @IsNotEmpty()
  users: string[];
}

export async function addWatchersDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new AddWatchersDto();
  DTO.users = req.body.users;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
