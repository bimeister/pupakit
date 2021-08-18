export function isTabletDevice(): boolean {
  return 'ontouchstart' in window;
}
