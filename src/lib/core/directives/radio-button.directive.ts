import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Renderer2
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive({
  selector: 'input[pupaRadioButton]'
})
export class RadioButtonDirective implements AfterViewInit, OnDestroy {
  @Input() public pupaRadioButton: string = '';
  // сюда передавать value кнопки
  public sub: Subscription = new Subscription();
  private circle: HTMLLabelElement;
  private dot: HTMLDivElement;
  public get checked(): boolean {
    return this.elementRef.nativeElement.checked;
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2,
    @Optional() private readonly control: NgControl
  ) {}

  private createCircle(): void {
    const circle: HTMLLabelElement = this.renderer.createElement('label');
    this.renderer.setAttribute(circle, 'for', this.elementRef.nativeElement.id);
    this.renderer.addClass(circle, 'pupa-radio__circle');
    this.renderer.addClass(circle, 'horizontal');
    this.circle = circle;
  }

  private createDot(): void {
    const div: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(div, 'pupa-radio__dot');
    this.dot = div;
  }

  private renderCircle(): void {
    if (isNullOrUndefined(this.circle)) {
      this.createCircle();
    }
    this.renderer.insertBefore(
      this.elementRef.nativeElement.parentElement,
      this.circle,
      this.elementRef.nativeElement.nextSibling
    );
  }

  private renderDot(): void {
    if (isNullOrUndefined(this.dot)) {
      this.createDot();
    }
    if (isNullOrUndefined(this.circle)) {
      this.renderCircle();
    }
    this.renderer.appendChild(this.circle, this.dot);
  }

  private setChecked(value: boolean): void {
    if (isNullOrUndefined(this.dot)) {
      this.renderDot();
    }
    const className: string = 'pupa-radio__dot_checked';
    if (value) {
      this.renderer.addClass(this.dot, className);
    } else {
      this.renderer.removeClass(this.dot, className);
    }
  }

  public ngAfterViewInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'value', this.pupaRadioButton);
    if (!isNullOrUndefined(this.control)) {
      this.sub.add(
        this.control.valueChanges.pipe(startWith(this.control.value)).subscribe((newValue: any) => {
          this.setChecked(newValue === this.pupaRadioButton);
        })
      );
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'pupa-radio');
    this.renderCircle();
    this.renderDot();
  }

  @HostListener('window:click')
  public onWindowClick(): void {
    if (!isNullOrUndefined(this.control)) {
      return;
    }
    this.setChecked(this.checked);
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
