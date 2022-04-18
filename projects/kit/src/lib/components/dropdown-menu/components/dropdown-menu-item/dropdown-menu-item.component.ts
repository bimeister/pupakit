import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { DROPDOWN_MENU_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/dropdown-menu-service.token';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropdownMenuService } from '../../../../../internal/declarations/interfaces/dropdown-menu-service.interface';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { DropdownContextService } from '../../services/dropdown-context.service';

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

  @Input() public plain: boolean = false;
  public plain$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() public readonly select: EventEmitter<void> = new EventEmitter<void>();

  private readonly isAlive$: Observable<boolean> = combineLatest([this.disabled$, this.plain$]).pipe(
    map(([disabled, plain]: [boolean, boolean]) => !disabled && !plain)
  );
  public tabindex$: Observable<Nullable<string>> = this.isAlive$.pipe(
    map((isAlive: boolean) => (isAlive ? '0' : null))
  );

  private readonly contextId: Uuid = this.dropdownContextService.contextId;

  constructor(
    private readonly dropdownContextService: DropdownContextService,
    @Inject(DROPDOWN_MENU_SERVICE_TOKEN) private readonly dropdownMenuService: DropdownMenuService
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processActiveChange(changes?.active);
    this.processDisabledChange(changes?.disabled);
    this.processPlainChange(changes?.plain);
  }

  @HostListener('click')
  public clicked(): void {
    this.isAlive$.pipe(take(1), filterTruthy()).subscribe(() => {
      this.dropdownMenuService.setDropdownIsOpen(this.contextId, false);
      this.select.emit();
    });
  }

  @HostListener('keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    this.isAlive$
      .pipe(
        take(1),
        filter((isAlive: boolean) => isAlive && event.key === 'Enter')
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

  private processPlainChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.plain$.next(updatedValue);
  }
}
