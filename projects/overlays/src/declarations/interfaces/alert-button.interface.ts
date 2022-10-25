import { ButtonKind } from '@bimeister/pupakit.kit';

export interface AlertButton {
  kind: ButtonKind;
  text: string;
  action();
}
