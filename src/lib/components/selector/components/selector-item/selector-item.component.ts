import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pupa-selector-item',
  templateUrl: './selector-item.component.html',
  styleUrls: ['./selector-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorItemComponent<T> {
  @Input() public value: T;

  private isSelected: boolean = false;
  public readonly isSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isSelected);

  /** @internal */
  public isEnabled: boolean = true;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public setSelected(value: boolean): void {
    this.isSelected = value;
    this.isSelected$.next(value);
  }

  public setEnabled(value: boolean): void {
    this.isEnabled = value;
    this.changeDetector.detectChanges();
  }

  @HostListener('click')
  public onClick(): void {
    if (this.isEnabled) {
      this.setSelected(!this.isSelected);
    }
  }
}
