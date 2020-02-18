import { AlertType } from './../types';

export interface Alert {
  type: AlertType;
  text: string;
  id: string;
  needClosed?: boolean;
}
