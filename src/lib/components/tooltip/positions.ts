import { ConnectedPosition } from '@angular/cdk/overlay';

const CENTER_BOTTOM_POSITION: ConnectedPosition = {
  originX: 'center',
  originY: 'top',
  overlayX: 'center',
  overlayY: 'bottom',
};
const CENTER_TOP_POSITION: ConnectedPosition = {
  originX: 'center',
  originY: 'bottom',
  overlayX: 'center',
  overlayY: 'top',
};

export const OVERLAY_POSITIONS: ConnectedPosition[] = [CENTER_BOTTOM_POSITION, CENTER_TOP_POSITION];
