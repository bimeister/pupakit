import { ButtonKind } from '../types/button-kind.type';

export interface AlertButton {
  kind: ButtonKind;
  text: string;
  action();
}
