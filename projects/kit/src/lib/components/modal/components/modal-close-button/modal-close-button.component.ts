import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

const DEFAULT_ICON: string = 'app-cross';

type VisibleOn = 'desktop' | 'mobile' | 'all';

const DEFAULT_VISIBLE_ON: VisibleOn = 'all';

@Component({
  selector: 'pupa-modal-close-button',
  templateUrl: './modal-close-button.component.html',
  styleUrls: ['./modal-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCloseButtonComponent<ValueT> implements OnChanges {
  @Input() public value: Nullable<ValueT>;

  @Input() public icon: string = DEFAULT_ICON;
  public readonly icon$: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_ICON);

  @Input() public visibleOn: VisibleOn = DEFAULT_VISIBLE_ON;
  public readonly visibleOn$: BehaviorSubject<VisibleOn> = new BehaviorSubject<VisibleOn>(DEFAULT_VISIBLE_ON);

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef<ValueT>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIconChange(changes?.icon);
    this.processVisibleOnChange(changes?.visibleOn);
  }

  public handleClick(): void {
    this.modalRef.close(this.value);
  }

  private processIconChange(change: ComponentChange<this, string>): void {
    const currentValue: string | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.icon$.next(currentValue);
  }

  private processVisibleOnChange(change: ComponentChange<this, VisibleOn>): void {
    const currentValue: VisibleOn | undefined = change?.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.visibleOn$.next(currentValue);
  }
}
