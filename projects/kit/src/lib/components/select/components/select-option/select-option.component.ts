import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { SelectOptionBase } from '../../../../../internal/declarations/classes/abstract/select-option-base.abstract';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'pupa-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent<T> extends SelectOptionBase<T> implements OnDestroy {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;
  @Input() public hasCheckbox: boolean = false;

  @Input() public heightPx: number = 32;

  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(protected readonly selectStateService: SelectStateService<T>) {
    super(selectStateService);
    this.subscription.add(this.subscribeToActionExpand());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToActionExpand(): void {
    this.selectStateService.isExpanded$.subscribe((isExpanded: boolean) => this.isOpened$.next(isExpanded));
  }
}
