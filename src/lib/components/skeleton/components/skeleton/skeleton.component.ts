import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { isNullOrUndefined } from '../../../../../internal';

@Component({
  selector: 'pupa-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent implements OnChanges {
  @Input() public isActive?: boolean;

  public readonly isActive$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef.detach();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes)) {
      return;
    }
    this.processIsActivePropertyChange(changes?.isActive);
  }

  private processIsActivePropertyChange(change: SimpleChange): void {
    if (isNullOrUndefined(change?.currentValue)) {
      return;
    }
    this.isActive$.next(change.currentValue);
  }
}
