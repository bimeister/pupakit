import { Component, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, AfterContentInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalLayoutActionComponent } from '../modal-layout-action/modal-layout-action.component';

@Component({
  selector: 'pupa-modal-layout-footer',
  templateUrl: './modal-layout-footer.component.html',
  styleUrls: ['./modal-layout-footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutFooterComponent implements AfterContentInit {
  @ContentChild(ModalLayoutActionComponent)
  private readonly modalLayoutActionComponent: ModalLayoutActionComponent<unknown>;

  public readonly withActions$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngAfterContentInit(): void {
    this.processWithFooterChange();
  }

  private processWithFooterChange(): void {
    const withActions: boolean = this.modalLayoutActionComponent !== undefined;
    this.withActions$.next(withActions);
  }
}
