import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostListener,
  Inject,
  ContentChild,
  HostBinding,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { ModalRef } from '../../../../declarations/classes/modal-ref.class';
import { Nullable } from '@bimeister/utilities';
import { ButtonComponent } from '@bimeister/pupakit.kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pupa-modal-layout-action',
  templateUrl: './modal-layout-action.component.html',
  styleUrls: ['./modal-layout-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutActionComponent<ValueT> implements AfterContentInit, OnDestroy {
  @ContentChild(ButtonComponent) public buttonComponent: ButtonComponent;

  @Input() public value: Nullable<ValueT> | 'none' = 'none';

  private readonly subscription: Subscription = new Subscription();

  @HostBinding('class.flexible') public isFlexible: boolean = false;

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef<ValueT>) {}

  @HostListener('click')
  public processActionClick(): void {
    if (this.value === 'none') {
      return;
    }
    this.modalRef.close(this.value);
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.setFlexibleClass());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setFlexibleClass(): Subscription {
    return this.buttonComponent.flexible$.subscribe((isFlexible: boolean) => {
      this.isFlexible = isFlexible;
    });
  }
}
