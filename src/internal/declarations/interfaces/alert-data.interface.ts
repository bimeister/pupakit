import { AlertType } from '../types/alert-type.type';
import { AlertButton } from './alert-button.interface';

export interface AlertData {
  bodyText: string;
  type: AlertType;
  title?: string;
  hasCloseButton?: boolean;
  buttons?: AlertButton[];
  autoCloseTimeMs?: number;
  closeAction?(): void;
}
