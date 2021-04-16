import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';

import { CheckboxServiceService } from '../../services/checkbox-service.service';

@Component({
  selector: 'pupa-checkbox-wrapper',
  templateUrl: './checkbox-wrapper.component.html',
  styleUrls: ['./checkbox-wrapper.component.scss'],
  providers: [CheckboxServiceService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxWrapperComponent implements AfterViewInit, OnDestroy {
  private eventUnlistener: EventUnlistener;

  @ViewChild('wrapperElement', { static: false }) public wrapperElementRef: ElementRef<HTMLElement>;
  constructor(private readonly checkboxServiceService: CheckboxServiceService, private readonly renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    this.eventUnlistener = this.listenClickEventWrapperClick();
  }

  public ngOnDestroy(): void {
    this.eventUnlistener();
  }

  private listenClickEventWrapperClick(): EventUnlistener {
    const contentElement: ChildNode = this.wrapperElementRef.nativeElement.children[1];

    if (isNil(contentElement)) {
      return undefined;
    }
    return this.renderer.listen(contentElement, 'click', () => {
      this.checkboxServiceService.changeValue();
    });
  }
}
