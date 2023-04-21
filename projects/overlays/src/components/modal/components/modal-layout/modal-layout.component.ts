import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalLayoutFooterComponent } from '../modal-layout-footer/modal-layout-footer.component';
import { ModalLayoutTitleComponent } from '../modal-layout-title/modal-layout-title.component';
import { ModalLayoutHeaderComponent } from '../modal-layout-header/modal-layout-header.component';
import { ModalRef } from '../../../../declarations/classes/modal-ref.class';
import { ModalHeightType } from '../../../../declarations/types/modal-height.type';

@Component({
  selector: 'pupa-modal-layout',
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalLayoutComponent implements AfterContentInit {
  @ContentChild(ModalLayoutFooterComponent) private readonly modalLayoutFooterComponent: ModalLayoutFooterComponent;

  public readonly withFooter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ContentChild(ModalLayoutTitleComponent) private readonly modalLayoutTitleComponent: ModalLayoutTitleComponent;

  public readonly withTitle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ContentChild(ModalLayoutHeaderComponent) public modalLayoutHeaderComponent: ModalLayoutHeaderComponent;

  public readonly withHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly withBorder: boolean = this.modalRef.hasBorder;

  @HostBinding('attr.height') public readonly modalHeight: ModalHeightType = this.modalRef.height;

  constructor(@Inject(ModalRef) public readonly modalRef: ModalRef<string>) {}

  public ngAfterContentInit(): void {
    this.processWithTitleChange();
    this.processWithFooterChange();
    this.processWithHeaderChange();
  }

  private processWithTitleChange(): void {
    const withTitle: boolean = this.modalLayoutTitleComponent !== undefined;
    this.withTitle$.next(withTitle);
  }

  private processWithFooterChange(): void {
    const withFooter: boolean = this.modalLayoutFooterComponent !== undefined;
    this.withFooter$.next(withFooter);
  }

  private processWithHeaderChange(): void {
    const withHeader: boolean = this.modalLayoutHeaderComponent !== undefined;
    this.withHeader$.next(withHeader);
  }
}
