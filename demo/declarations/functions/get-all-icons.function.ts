// eslint-disable-next-line import-blacklist
import * as iconsList from '../../../src/internal/constants/icons/api';
import { IconDefinition } from '../../../src/internal/declarations/interfaces/icon-definition.interface';

export function getAllIcons(): IconDefinition[] {
  return Object.values(iconsList);
}
