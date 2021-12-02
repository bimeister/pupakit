import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GridStateService {
  public readonly isGridVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public toggleGridVisibleState(): void {
    this.isGridVisible$
      .pipe(
        take(1),
        map((isGridVisible: boolean) => !isGridVisible)
      )
      .subscribe((newState: boolean) => this.isGridVisible$.next(newState));
  }
}
