import { Component, ContentChildren, QueryList, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'pupa-dropdown-menu-content',
  templateUrl: './dropdown-menu-content.component.html',
  styleUrls: ['./dropdown-menu-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuContentComponent implements AfterContentInit {
  public readonly contentVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public isLeftSided: boolean = false;

  @ContentChildren(DropdownMenuItemComponent)
  private readonly items: QueryList<DropdownMenuItemComponent> = new QueryList();
  private readonly items$: BehaviorSubject<DropdownMenuItemComponent[]> = new BehaviorSubject([]);
  public readonly onItemClick$: Observable<DropdownMenuItemComponent> = this.items$.pipe(
    switchMap((items: DropdownMenuItemComponent[]) =>
      merge(...items.map((item: DropdownMenuItemComponent) => item.onClick$))
    )
  );

  public ngAfterContentInit(): void {
    this.items$.next(this.items.toArray());
  }

  public setVisibleState(visible: boolean): void {
    this.contentVisible$.next(visible);
  }
}
