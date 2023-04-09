import type { Request, Response } from 'express';
import { IUser } from '~/domain/entities';
import { UserRepository } from '~/domain/repositories';
import bcrypt from 'bcrypt';

export async function signUp(req: Request, res: Response) {
  try {
    const user: IUser = req.body;
    user.password = await bcrypt.hash(req.body.password, 10);
    const userCreated = await UserRepository.addUser(user);
    res.status(200);
    res.json({
      message: 'user created',
      user: userCreated,
    });
  } catch (e) {
    res.status(500);
    res.json({
      error: e,
    });
  }
}
