import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { TagBase } from '../../../../../internal/declarations/classes/abstract/tag-base.abstract';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'pupa-tag-inline, [pupaTagInline]',
  templateUrl: './tag-inline.component.html',
  styleUrls: ['./tag-inline.component.scss'],
  providers: [TagStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagInlineComponent extends TagBase implements AfterContentInit {
  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer2: Renderer2,
    tagStateService: TagStateService
  ) {
    super(tagStateService);
  }

  public ngAfterContentInit(): void {
    this.setInlineStyleForElements(this.elementRef?.nativeElement?.children);
  }

  private setInlineStyleForElements(elements: Nullable<HTMLCollection>): void {
    if (isNil(elements)) {
      return;
    }

    Array.from(elements).forEach((element: HTMLElement) => {
      if (element.children.length !== 0) {
        this.setInlineStyleForElements(element.children);
      }
      this.setInlineStyle(element);
    });
  }

  private setInlineStyle(element: HTMLElement): void {
    this.renderer2.setStyle(element, 'display', 'inline');
  }
}
