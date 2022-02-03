import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-skeleton-group',
  templateUrl: './skeleton-group.component.html',
  styleUrls: ['./skeleton-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonGroupComponent {
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.changeDetectorRef.detach();
  }
}
