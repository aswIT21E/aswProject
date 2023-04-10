import { Schema, model } from 'mongoose';

import type { IFilter } from './filter.interface';

const FilterSchema = new Schema({
  tipo: { required: false, type: [String] },
  gravedad: { required: false, type: [String]},
  estado: { required: false, type: [String]},
  crated_by: { required: false, type: [String] },
  asign_to: { required: false, type: [String]},
  tags: { required: false, type: [String]},
});


const FilterModel = model<IFilter>('Filter', FilterSchema);

export { FilterModel };