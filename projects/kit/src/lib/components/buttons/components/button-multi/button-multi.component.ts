import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DropdownMenuContentComponent } from '../../../dropdown-menu/components/dropdown-menu-content/dropdown-menu-content.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ButtonComponent } from '../button/button.component';
import { DropdownMenuDirective } from '../../../dropdown-menu/directives/dropdown-menu.directive';
import { ButtonMultiKind } from '../../../../../internal/declarations/types/button-multi-kind.type';

@Component({
  selector: 'pupa-button-multi',
  templateUrl: './button-multi.component.html',
  styleUrls: ['./button-multi.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiComponent extends ButtonComponent implements OnChanges, AfterViewInit {
  @Input() public readonly dropdownMenuContent: DropdownMenuContentComponent;

  @Input() public readonly kind: ButtonMultiKind = 'primary';

  @ViewChild(DropdownMenuDirective) private readonly dropdownMenu: DropdownMenuDirective;

  private readonly isComponentViewReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isMenuOpened$: Observable<boolean> = this.isComponentViewReady$.pipe(
    startWith(false),
    filterTruthy(),
    switchMap(() => this.dropdownMenu.isOpen$)
  );

  public readonly resultClassListExpand$: Observable<string[]> = combineLatest([...this.commonButtonClasses]).pipe(
    map((classes: string[]) =>
      classes
        .filter((innerClass: string) => !isNil(innerClass))
        .map((innerProperty: string) => `button_${innerProperty}`)
    )
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    super.ngOnChanges(changes);
  }

  public ngAfterViewInit(): void {
    this.isComponentViewReady$.next(true);
  }
}
