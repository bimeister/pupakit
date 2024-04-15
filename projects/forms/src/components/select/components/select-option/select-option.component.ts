import { ChangeDetectionStrategy, Component, ContentChild, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../services/select-state.service';
import { SelectOptionBase } from '../../../../declarations/classes/abstract/select-option-base.abstract';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OptionActionsRightDirective } from '@bimeister/pupakit.kit';

@Component({
  selector: 'pupa-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent<T> extends SelectOptionBase<T> implements OnDestroy {
  @ContentChild(OptionActionsRightDirective) public optionActionsRightDirective: OptionActionsRightDirective;
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;
  @Input() public hasCheckbox: boolean = false;

  @Input() public heightRem: number = 8;

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
