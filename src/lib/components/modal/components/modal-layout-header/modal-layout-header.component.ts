import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalLayoutTitleComponent } from '../modal-layout-title/modal-layout-title.component';

@Component({
  selector: 'pupa-modal-layout-header',
  templateUrl: './modal-layout-header.component.html',
  styleUrls: ['./modal-layout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalLayoutHeaderComponent implements AfterContentInit {
  @ContentChild(ModalLayoutTitleComponent) private readonly modalLayoutTitleComponent: ModalLayoutTitleComponent;

  public readonly withTitle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ngAfterContentInit(): void {
    this.processWithTitleChange();
  }

  private processWithTitleChange(): void {
    const withTitle: boolean = this.modalLayoutTitleComponent !== undefined;
    this.withTitle$.next(withTitle);
  }
}
