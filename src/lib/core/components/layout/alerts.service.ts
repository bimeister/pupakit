import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export type AlertType = 'info' | 'warning' | 'success' | 'danger';

export interface Alert {
  type: AlertType;
  text: string;
  id: string;
  needClosed?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  public alerts$: BehaviorSubject<Map<string, Alert>> = new BehaviorSubject<Map<string, Alert>>(
    new Map<string, Alert>()
  );

  private index: number = 0;

  public create(alert: Alert): Observable<string> {
    return this.alerts$.pipe(
      take(1),
      map((alertCollection: Map<string, Alert>) => {
        const id: string = this.createNewId();
        const copyAlert: Alert = {
          ...alert,
          id: this.createNewId()
        };
        alertCollection.set(copyAlert.id, copyAlert);
        this.alerts$.next(alertCollection);
        return id;
      })
    );
  }

  public closeAlertById(alertId: string): void {
    this.alerts$.pipe(take(1)).subscribe((collection: Map<string, Alert>) => {
      collection.delete(alertId);
      this.alerts$.next(collection);
    });
  }

  private createNewId(): string {
    return `alert-id-${this.index++}-${new Date().getTime()}`;
  }
}
