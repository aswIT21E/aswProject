import type { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { UserModel } from '~/domain/entities/user';
import type { GoogleAuthDto } from '~/infrastructure';

export async function googleAuth(req: Request, res: Response): Promise<void> {
  console.log('google auth');
  try {
    const client = new OAuth2Client(process.env.OAUTH_CLIENT);
    const credentials: GoogleAuthDto = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credentials.credentials,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userName = payload.given_name;

    const user = await UserModel.findOne({ username: userName });
    if (user) {
      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      res.status(200).json({ token });
    } else {
      await UserModel.create({
        username: payload.given_name,
        email: payload.email,
        name: payload.name,
        bio: payload.profile,
        profilePicture: payload.picture,
        password: '',
      });
      const token = jwt.sign(
        { username: payload.given_name },
        process.env.SECRET,
      );
      res.status(200).json({ token });
    }
  } catch (e) {
    res.status(500);
    res.json({
      error: e,
    });
  }
}
