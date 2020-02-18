import { WasherButton } from './washer-button.interface';

export interface WasherButtonRoot extends WasherButton {
  /**
   * @description when true, shows range control on click
   */
  rangeOnClick: boolean;

  /**
   * @description button is visible on washer unhovered state when true
   */
  isAlwaysVisible: boolean;

  /**
   * @description array of child buttons to be visible on external disk
   */
  children?: WasherButton[];
}
