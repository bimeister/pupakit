import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { VirtualScrollViewportComponent } from '../../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';

@Component({
  selector: 'pupa-paged-virtual-scroll-viewport',
  templateUrl: './paged-virtual-scroll-viewport.component.html',
  styleUrls: ['./paged-virtual-scroll-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PagedVirtualScrollStateService]
})
export class PagedVirtualScrollViewportComponent implements AfterViewInit, OnChanges {
  @Input() public itemSize: number;
  public readonly itemSize$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  @ViewChild('cdkViewport', { static: false }) private readonly viewport: VirtualScrollViewportComponent;

  constructor(private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService) {}

  public ngAfterViewInit(): void {
    this.setViewportComponent();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTemplateCacheSizeChange(changes?.itemSize);
  }

  private setViewportComponent(): void {
    this.pagedVirtualScrollStateService.setViewportComponent(this.viewport);
  }

  private processTemplateCacheSizeChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    const serializedSize: number = updatedValue;
    this.itemSize$.next(serializedSize);
  }
}
