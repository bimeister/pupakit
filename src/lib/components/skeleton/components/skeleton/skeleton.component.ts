import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ReplaySubject } from 'rxjs';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

@Component({
  selector: 'pupa-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent implements OnChanges {
  @Input() public isActive?: boolean;

  public readonly isActive$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef.detach();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processIsActivePropertyChange(changes?.isActive);
  }

  private processIsActivePropertyChange(change: ComponentChange<this, boolean>): void {
    if (isNil(change?.currentValue)) {
      return;
    }
    this.isActive$.next(change.currentValue);
  }
}
