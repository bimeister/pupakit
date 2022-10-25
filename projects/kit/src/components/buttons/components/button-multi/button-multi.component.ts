import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { filterTruthy, isNil } from '@bimeister/utilities';
import { ButtonComponent } from '../button/button.component';
import { ButtonMultiKind } from '../../../../declarations/types/button-multi-kind.type';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { DropdownDirective } from '../../../dropdown/directives/dropdown.directive';
import { DropdownHost } from '../../../../declarations/interfaces/dropdown-host.interface';
import { DropdownDirectiveParams } from '../../../../declarations/interfaces/dropdown-directive-params.interface';

@Component({
  selector: 'pupa-button-multi',
  templateUrl: './button-multi.component.html',
  styleUrls: ['./button-multi.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonMultiComponent extends ButtonComponent implements OnChanges, AfterViewInit, DropdownHost {
  @Input() public readonly kind: ButtonMultiKind = 'primary';

  @ViewChild(DropdownDirective, { static: true }) private readonly dropdown: DropdownDirective;

  private readonly isComponentViewReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isMenuOpened$: Observable<boolean> = this.isComponentViewReady$.pipe(
    startWith(false),
    filterTruthy(),
    switchMap(() => this.dropdown.opened$)
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

  public setDropdownParams(params: DropdownDirectiveParams): void {
    this.dropdown.setDropdownParams(params);
  }
}
