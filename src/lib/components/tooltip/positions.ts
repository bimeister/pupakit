import { ConnectedPosition } from '@angular/cdk/overlay';

const OVERLAY_TOP_POSITION: ConnectedPosition = {
  originX: 'center',
  originY: 'top',
  overlayX: 'center',
  overlayY: 'bottom',
};
const OVERLAY_RIGHT_POSITION: ConnectedPosition = {
  originX: 'end',
  originY: 'center',
  overlayX: 'start',
  overlayY: 'center',
};
const OVERLAY_BOTTOM_POSITION: ConnectedPosition = {
  originX: 'center',
  originY: 'bottom',
  overlayX: 'center',
  overlayY: 'top',
};
const OVERLAY_LEFT_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'center',
  overlayX: 'end',
  overlayY: 'center',
};
const OVERLAY_LEFT_TOP_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'end',
  overlayY: 'bottom',
};
const OVERLAY_RIGHT_TOP_POSITION: ConnectedPosition = {
  originX: 'end',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'bottom',
};
const OVERLAY_RIGHT_BOTTOM_POSITION: ConnectedPosition = {
  originX: 'end',
  originY: 'bottom',
  overlayX: 'start',
  overlayY: 'top',
};
const OVERLAY_LEFT_BOTTOM_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'bottom',
  overlayX: 'end',
  overlayY: 'top',
};

export const OVERLAY_POSITIONS: ConnectedPosition[] = [
  OVERLAY_TOP_POSITION,
  OVERLAY_RIGHT_POSITION,
  OVERLAY_BOTTOM_POSITION,
  OVERLAY_LEFT_POSITION,
  OVERLAY_LEFT_TOP_POSITION,
  OVERLAY_RIGHT_TOP_POSITION,
  OVERLAY_RIGHT_BOTTOM_POSITION,
  OVERLAY_LEFT_BOTTOM_POSITION,
];
