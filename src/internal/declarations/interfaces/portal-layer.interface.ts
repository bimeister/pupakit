export interface PortalLayer {
  readonly id: string;
  getCurrentZIndex(): number;
  moveToZIndex(zIndex: number): void;
}
