// eslint-disable-next-line no-restricted-imports
import * as iconsList from '@kit/internal/constants/icons/api';
import { IconDefinition } from '@kit/internal/declarations/interfaces/icon-definition.interface';

export function getAllIcons(): IconDefinition[] {
  return Object.values(iconsList);
}
