import { isNil } from '@bimeister/utilities';

export function getFormattedTimeDigit(entity: unknown): string {
  if (isNil(entity)) {
    return '00';
  }

  const incomingNumber: number = parseInt(entity?.toString(), 10);

  if (isNaN(incomingNumber)) {
    return incomingNumber.toString();
  }

  return incomingNumber.toString().padStart(2, '0');
}
