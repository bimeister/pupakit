import { IconDefinition } from '../interfaces/icon-definition.interface';
// eslint-disable-next-line no-restricted-imports
import * as ALL_ICONS from '../constants/icons/api';

export function getAllIcons(): IconDefinition[] {
  return Object.values(ALL_ICONS);
}
