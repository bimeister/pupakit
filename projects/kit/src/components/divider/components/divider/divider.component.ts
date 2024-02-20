import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ComponentChange } from '@bimeister/pupakit.common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DividerOrientation } from '../../../../declarations/types/divider-orientation.type';
import { DividerService } from '../../services/divider.service';

@Component({
  selector: 'pupa-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DividerService],
})
export class DividerComponent implements OnChanges {
  @Input() public orientation: DividerOrientation = 'horizontal';

  public readonly dividerClasses$: Observable<string> = this.dividerService.orientation$.pipe(
    map((orientation: DividerOrientation) => `pupa-divider pupa-divider_${orientation}`)
  );

  constructor(private readonly dividerService: DividerService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('orientation')) {
      this.processOrientationChange(changes.orientation);
    }
  }

  private processOrientationChange(change: ComponentChange<this, DividerOrientation>): void {
    this.dividerService.setOrientation(change.currentValue);
  }
}
