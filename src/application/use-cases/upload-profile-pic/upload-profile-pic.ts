import type { Request, Response } from 'express';

import { UserRepository } from '~/domain/repositories';
import { S3Service } from '~/infrastructure/services';
import { getActor } from '~/utils';

export async function uploadProfilePic(
  req: Request,
  res: Response,
): Promise<void> {
  const file = req.files.file;
  try {
    const user = await getActor(req);

    if (user) {
      const uploadService = new S3Service();

      const result = await uploadService.uploadFile(file);
      console.log(result.Location);
      user?.updateProfilePic(result.Location);
      console.log(user);
      await UserRepository.editarUser(user, user);
      const useract = await UserRepository.getUserByUsername(user.username);
      console.log(useract);
      const token = req.header('Authorization').split(' ')[1];
      res.redirect(`http://localhost:8081/myProfile/${token}`);
    } else {
      res.status(404).json({
        message: `User not found`,
      });
    }
  } catch (e) {
    res.status(500);
    res.json({
      error: e,
    });
  }
}
