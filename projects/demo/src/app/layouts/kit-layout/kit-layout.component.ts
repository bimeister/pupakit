import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ScrollableComponent } from '@kit/lib/components/scrollable/components/scrollable/scrollable.component';
import { AnchorService } from '../../common/services/anchor.service';

@Component({
  selector: 'demo-kit-layout',
  templateUrl: './kit-layout.component.html',
  styleUrls: ['./kit-layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnchorService],
})
export class KitLayoutComponent implements AfterViewInit {
  @ViewChild(ScrollableComponent, { static: true })
  private readonly scrollableComponent: ScrollableComponent;

  constructor(private readonly anchorService: AnchorService) {}

  public ngAfterViewInit(): void {
    this.setAnchorsScrollableParent();
  }

  private setAnchorsScrollableParent(): void {
    this.anchorService.setScrollableParent(this.scrollableComponent.element);
  }
}
