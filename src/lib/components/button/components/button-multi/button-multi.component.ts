import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropdownMenuContentComponent } from '../../../dropdown-menu/components/dropdown-menu-content/dropdown-menu-content.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'pupa-button-multi',
  templateUrl: './button-multi.component.html',
  styleUrls: ['./button-multi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonMultiComponent extends ButtonComponent {
  @Input() public readonly dropdownMenuContent: DropdownMenuContentComponent;
  @Input() public readonly expandActive: boolean = false;
  public readonly expandActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly resultClassList$: Observable<string[]> = combineLatest([
    this.size$,
    this.kind$,
    this.disabled$.pipe(map((isDisabled: boolean) => (isDisabled ? 'disabled' : null))),
    this.active$.pipe(map((isActive: boolean) => (isActive ? 'active' : null))),
    this.expandActive$.pipe(map((isActive: boolean) => (isActive ? 'expand-active' : null))),
    this.iconContainerClass$
  ]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `button-multi_${innerProperty}`)
    )
  );
  public readonly mainClassList$: Observable<string[]> = this.active$.pipe(
    map((isActive: boolean) => (isActive ? ['main_active'] : []))
  );
  public readonly expandClassList$: Observable<string[]> = this.expandActive$.pipe(
    map((isActive: boolean) => (isActive ? ['expand_active'] : []))
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    super.ngOnChanges(changes);
    this.processExpandActiveChange(changes?.expandActive);
  }

  public getIconName$(isOpen$: Observable<boolean>): Observable<string> {
    return isOpen$.pipe(map((isOpen: boolean) => (isOpen ? 'ios-arrow-up' : 'ios-arrow-down')));
  }

  private processExpandActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.expandActive$.next(updatedValue);
  }
}
