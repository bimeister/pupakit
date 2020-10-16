import { Observable } from 'rxjs';

export interface OpenedDrawer<ReturnDataT = null> {
  id: string;
  closed$: Observable<ReturnDataT>;
}
