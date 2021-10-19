import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalLayoutFooterComponent } from '../modal-layout-footer/modal-layout-footer.component';
import { ModalLayoutTitleComponent } from '../modal-layout-title/modal-layout-title.component';

@Component({
  selector: 'pupa-modal-layout',
  templateUrl: './modal-layout.component.html',
  styleUrls: ['./modal-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalLayoutComponent implements AfterContentInit {
  @ContentChild(ModalLayoutFooterComponent) private readonly modalLayoutFooterComponent: ModalLayoutFooterComponent;

  public readonly withFooter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ContentChild(ModalLayoutTitleComponent) private readonly modalLayoutTitleComponent: ModalLayoutTitleComponent;

  public readonly withTitle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngAfterContentInit(): void {
    this.processWithTitleChange();
    this.processWithFooterChange();
  }

  private processWithTitleChange(): void {
    const withTitle: boolean = this.modalLayoutTitleComponent !== undefined;
    this.withTitle$.next(withTitle);
  }

  private processWithFooterChange(): void {
    const withFooter: boolean = this.modalLayoutFooterComponent !== undefined;
    this.withFooter$.next(withFooter);
  }
}
