import { ChangeDetectionStrategy, Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { MODAL_DATA_TOKEN } from '../../../../../../declarations/tokens/modal-data.token';
import { BehaviorSubject, Observable } from 'rxjs';
import { isNil, Nullable } from '@bimeister/utilities';

@Component({
  selector: 'pupa-modal-demo-example-7',
  templateUrl: './modal-demo-example-7.component.html',
  styleUrls: ['./modal-demo-example-7.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample7Component implements OnInit {
  private readonly modalDataState$: BehaviorSubject<Nullable<any>> = new BehaviorSubject<Nullable<any>>(null);

  public readonly modalData$: Observable<Nullable<any>> = this.modalDataState$.asObservable();

  constructor(@Inject(MODAL_DATA_TOKEN) @Optional() private readonly modalData: any) {}

  public ngOnInit(): void {
    if (!isNil(this.modalData)) {
      this.modalDataState$.next(this.modalData);
    }
  }
}
