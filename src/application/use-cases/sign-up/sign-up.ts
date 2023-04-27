import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

import type { IUser } from '~/domain/entities';
import { UserRepository } from '~/domain/repositories';

export async function signUp(req: Request, res: Response) {
  try {
    const user: IUser = req.body;
    user.password = await bcrypt.hash(req.body.password, 10);
    await UserRepository.addUser(user);
    res.status(200);
    res.redirect(`${process.env.API_URL}/login`);
  } catch (e) {
    res.status(500);
    res.json({
      error: e,
    });
  }
}
