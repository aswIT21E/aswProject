import { IsString,  } from 'class-validator';
import { validate } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

class FilterDTO{
  
  
  @IsString()
  tipo?: string[];
     
  @IsString()
  status?: string[];

  @IsString()
  assignee?: string;

  @IsString()
  createdBy?: string;
  

  asignedTo?: string;
  
  @IsString()
  priority?: string[] | null;

}

export async function filterDto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const DTO = new FilterDTO();
  DTO.tipo = req.body.tipo;
  DTO.status = req.body.status;
  DTO.asignedTo = req.body.asign_to;
  DTO.assignee = req.body.assignee;
  DTO.createdBy = req.body.createdBy;
  DTO.priority = req.body.priority;

  const errors = await validate(DTO);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
