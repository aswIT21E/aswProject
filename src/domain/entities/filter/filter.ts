import type { IFilter } from './filter.interface';

export class Filter implements IFilter {
 public tipo?: string[];
  public gravedad?: string[];
  public prioridad?: string[];
  public estado?: string[];
  public crated_by?: string[];
  public asign_to?: string[];
  public tags?: string[];
  public asignee?: string[];

  constructor(
    tipo?: string[],
    gravedad?: string[],
    prioridad?: string[],
    estado?: string[],
    crated_by?: string[],
    asign_to?: string[],
    tags?: string[],
    asignee?: string[],
  ) {
    this.tipo = tipo;
    this.gravedad = gravedad;
    this.prioridad = prioridad
    this.estado = estado;
    this.crated_by = crated_by;
    this.asign_to = asign_to;
    this.tags = tags;
    this.asignee = asignee;
  }
}
