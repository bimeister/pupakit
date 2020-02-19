import { DrawerFloat } from '../types/drawer-float.type';

export interface LayoutDrawerConfiguration {
  enableOverlay?: boolean;
  clickableOverlay?: boolean;
  float?: DrawerFloat;
  zIndex?: number;
  closeButton?: boolean;
  withPadding?: boolean;
  destroyContentOnClose?: boolean;
  data?: Record<string, any>;
}
