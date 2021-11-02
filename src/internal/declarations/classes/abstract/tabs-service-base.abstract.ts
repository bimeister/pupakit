import { asyncScheduler, BehaviorSubject, Observable } from 'rxjs';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { filter, subscribeOn, take } from 'rxjs/operators';

export abstract class TabsServiceBase {
  private readonly activeTabNameState$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public readonly activeTabName$: Observable<Nullable<string>> = this.activeTabNameState$.asObservable();

  private readonly tabNames: string[] = [];

  public registerTab(tabName: string): void {
    this.tabNames.push(tabName);
  }

  public setInitialTab(): void {
    this.activeTabName$
      .pipe(
        take(1),
        filter((activeTab: Nullable<string>) => isNil(activeTab) && !isEmpty(this.tabNames)),
        subscribeOn(asyncScheduler)
      )
      .subscribe(() => {
        this.setActiveTab(this.tabNames[0]);
      });
  }

  public setActiveTab(tabName: string): void {
    this.activeTabNameState$.next(tabName);
  }
}
