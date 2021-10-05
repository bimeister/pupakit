import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly isVisibleState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isVisible$: Observable<boolean> = this.isVisibleState$.asObservable();

  public hide(): void {
    this.isVisibleState$.next(false);
  }

  public show(): void {
    this.isVisibleState$.next(true);
  }
}
