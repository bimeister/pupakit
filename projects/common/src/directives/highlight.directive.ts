import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// Adds 'px' to the number and turns it into a string
const addPx = (value: number): string => {
  if (!Number.isFinite(value)) {
    throw new Error('Input is not a finite number');
  }
  return `${value}px`;
};

@Directive({
  selector: '[pupaHighlight]',
})
export class HighlightDirective implements OnChanges, OnInit {
  @Input() public readonly pupaHighlight: string = '';
  @Input() public readonly pupaHighlightKind: string = 'rgb(var(--semantic-color_kind-success-normal))';

  @HostBinding('style.position') private readonly position: string = 'relative';
  @HostBinding('style.zIndex') private readonly zIndex: string = '0';

  private readonly highlight: HTMLElement = this.setUpHighlight();
  private readonly treeWalker: TreeWalker = this.doc.createTreeWalker(this.el.nativeElement, NodeFilter.SHOW_TEXT);

  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(Renderer2) private readonly renderer: Renderer2,
    @Inject(ElementRef) private readonly el: ElementRef<HTMLElement>
  ) {}

  private get match(): boolean {
    return this.indexOf(this.el.nativeElement.textContent) !== -1;
  }

  public ngOnChanges(): void {
    this.updateStyles();
  }

  public ngOnInit(): void {
    this.el.nativeElement.style.position = this.position;
    this.el.nativeElement.style.zIndex = this.zIndex;
    this.highlight.style.background = this.pupaHighlightKind;
  }

  private indexOf(source: string | null): number {
    return source === '' || this.pupaHighlight === ''
      ? -1
      : source.toLowerCase().indexOf(this.pupaHighlight.toLowerCase());
  }

  private updateStyles(): void {
    this.highlight.style.display = 'none';

    if (!this.match) {
      return;
    }

    this.treeWalker.currentNode = this.el.nativeElement;

    do {
      const index: number = this.indexOf(this.treeWalker.currentNode.nodeValue);

      if (index === -1) {
        continue;
      }

      const range: Range = this.doc.createRange();

      range.setStart(this.treeWalker.currentNode, index);
      range.setEnd(this.treeWalker.currentNode, index + this.pupaHighlight.length);

      this.setStyleHighlight(range);

      return;
    } while (this.treeWalker.nextNode());
  }

  private setStyleHighlight(range: Range): void {
    const hostRect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    const { left, top, width, height } = range.getBoundingClientRect();

    this.highlight.style.background = this.pupaHighlight;
    this.highlight.style.left = addPx(left - hostRect.left);
    this.highlight.style.top = addPx(top - hostRect.top);
    this.highlight.style.width = addPx(width);
    this.highlight.style.height = addPx(height);
    this.highlight.style.display = 'block';
  }

  private setUpHighlight(): HTMLDivElement {
    const highlight: HTMLDivElement = this.renderer.createElement('div');

    highlight.style.zIndex = '-1';
    highlight.style.position = 'absolute';
    this.renderer.appendChild(this.el.nativeElement, highlight);

    return highlight;
  }
}
