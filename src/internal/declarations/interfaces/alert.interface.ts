import { AlertType } from '../types/alert.type';

export interface Alert {
  type: AlertType;
  text: string;
  id: string;
  needClosed?: boolean;
}
