import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filterFalsy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DROPDOWN_MENU_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/dropdown-menu-service.token';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropdownMenuService } from '../../../../../internal/declarations/interfaces/dropdown-menu-service.interface';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { DropdownContextService } from '../../services/dropdown-context.service';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';

@Component({
  selector: 'pupa-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuItemComponent implements OnChanges {
  @Input() public active: boolean = false;
  public active$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public disabled: boolean = false;
  public disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() public readonly select: EventEmitter<void> = new EventEmitter<void>();

  public readonly theme$: Observable<Theme> = this.themeWrapperService?.theme$;
  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly contextId: Uuid = this.dropdownContextService.contextId;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly dropdownContextService: DropdownContextService,
    @Inject(DROPDOWN_MENU_SERVICE_TOKEN) private readonly dropdownMenuService: DropdownMenuService,
    @Optional() private readonly themeWrapperService: ThemeWrapperService
  ) {
    this.subscription.add(this.subscribeToContentOpen());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processActiveChange(changes?.active);
    this.processDisabledChange(changes?.disabled);
  }

  @HostListener('click')
  public clicked(): void {
    this.disabled$.pipe(take(1), filterFalsy()).subscribe(() => {
      this.dropdownMenuService.setDropdownIsOpen(this.contextId, false);
      this.select.emit();
    });
  }

  @HostListener('keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    this.disabled$
      .pipe(
        take(1),
        filter((disabled: boolean) => !disabled && event.key === 'Enter')
      )
      .subscribe(() => {
        this.dropdownMenuService.setDropdownIsOpen(this.contextId, false);
        this.select.emit();
      });
  }

  private processActiveChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.active$.next(updatedValue);
  }

  private processDisabledChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.disabled$.next(updatedValue);
  }

  private subscribeToContentOpen(): void {
    this.dropdownMenuService
      .getDropdownIsOpen(this.contextId)
      .subscribe((isOpen: boolean) => this.isOpened$.next(isOpen));
  }
}
