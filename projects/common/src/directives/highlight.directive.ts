import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HighlightKind } from '@bimeister/pupakit.kit/src/declarations/types/highlight-kind.type';

const addPx = (value: number): string => {
  if (!Number.isFinite(value)) {
    throw new Error('Input is not a finite number');
  }
  return `${value}px`;
};

const acceptNode = (node: Node): number =>
  node.parentElement.parentElement.classList.contains('table-body-cell__content')
    ? NodeFilter.FILTER_ACCEPT
    : NodeFilter.FILTER_SKIP;

@Directive({
  selector: '[pupaHighlight]',
})
export class HighlightDirective implements OnChanges, OnInit {
  @Input() public pupaHighlight: string = '';
  @Input() public pupaHighlightKind: HighlightKind = 'primary';

  @HostBinding('style.position') private readonly position: string = 'relative';
  @HostBinding('style.zIndex') private readonly zIndex: string = '0';

  private readonly highlight: HTMLElement = this.setUpHighlight();
  private readonly treeWalker: TreeWalker = this.document.createTreeWalker(
    this.elementRef.nativeElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode,
    }
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(Renderer2) private readonly renderer: Renderer2,
    @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  private get match(): boolean {
    return this.indexOf(this.elementRef.nativeElement.textContent) !== -1;
  }

  public ngOnChanges(): void {
    this.updateStyles();
  }

  public ngOnInit(): void {
    this.elementRef.nativeElement.style.position = this.position;
    this.elementRef.nativeElement.style.zIndex = this.zIndex;
    this.highlight.classList.add(`highlight_${this.pupaHighlightKind}`);
  }

  private indexOf(source: string | null): number {
    return !source || !this.pupaHighlight ? -1 : source.toLowerCase().indexOf(this.pupaHighlight.toLowerCase());
  }

  private updateStyles(): void {
    this.highlight.style.display = 'none';

    if (!this.match) {
      return;
    }

    this.treeWalker.currentNode = this.elementRef.nativeElement;

    while (this.treeWalker.nextNode()) {
      const index: number = this.indexOf(this.treeWalker.currentNode.nodeValue);

      if (index === -1) {
        continue;
      }

      const range: Range = this.document.createRange();

      range.setStart(this.treeWalker.currentNode, index);
      range.setEnd(this.treeWalker.currentNode, index + this.pupaHighlight.length);

      this.setStyleHighlight(range);

      return;
    }
  }

  private setStyleHighlight(range: Range): void {
    const hostRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
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
    this.renderer.appendChild(this.elementRef.nativeElement, highlight);

    return highlight;
  }
}
