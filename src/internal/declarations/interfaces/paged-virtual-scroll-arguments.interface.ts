export interface PagedVirtualScrollArguments {
  getFrom: number;
  getTo: number;

  removeFrom: number;
  removeTo: number;

  currentFrom: number;
  currentTo: number;

  previousFrom: number;
  previousTo: number;
}
