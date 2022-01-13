import { AlertType } from '../types/alert-type.type';

export interface ToastData {
  bodyText: string;
  type: AlertType;
  autoCloseTimeMs?: number;
  hasTimer?: boolean;
  actionText?: string;
}
