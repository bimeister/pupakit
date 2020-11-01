import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject } from 'rxjs';

import { UploadingStatus } from '../../../../../internal/declarations/enums/uploading-status.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-uploads-item-status',
  templateUrl: './uploads-item-status.component.html',
  styleUrls: ['./uploads-item-status.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsItemStatusComponent implements OnChanges {
  public readonly uploadingStatus: typeof UploadingStatus = UploadingStatus;

  @Input() public status: UploadingStatus;
  public status$: BehaviorSubject<UploadingStatus> = new BehaviorSubject(UploadingStatus.Pending);

  @Input() public percentage: number;
  public percentage$: BehaviorSubject<number> = new BehaviorSubject(0);

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }

    this.processStatusChanges(changes.status);
    this.processPercentageChanges(changes.percentage);
  }

  private processStatusChanges(changes: ComponentChange<this, UploadingStatus>): void {
    const status: UploadingStatus | undefined = changes?.currentValue;

    if (isNil(status)) {
      return;
    }

    this.status$.next(status);
  }

  private processPercentageChanges(changes: ComponentChange<this, number>): void {
    const percentage: number | undefined = changes?.currentValue;

    if (isNil(status)) {
      return;
    }

    this.percentage$.next(percentage);
  }
}
