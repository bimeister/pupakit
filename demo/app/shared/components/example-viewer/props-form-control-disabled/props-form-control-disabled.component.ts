import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { isNil } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { PropsCheckboxComponent } from '../props-checkbox/props-checkbox.component';

@Component({
  selector: 'demo-props-form-control-disabled',
  templateUrl: './props-form-control-disabled.component.html',
  styleUrls: ['./props-form-control-disabled.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropsFormControlDisabledComponent implements AfterViewInit, OnDestroy {
  @ViewChild(PropsCheckboxComponent)
  private readonly propsCheckbox: PropsCheckboxComponent;
  private readonly subscription: Subscription = new Subscription();

  @Input()
  public readonly control: FormControl;

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.propsCheckbox.subscribe((isDisabled: boolean) => {
        if (isNil(this.control)) {
          return;
        }

        if (isDisabled) {
          this.control.disable();
          return;
        }

        this.control.enable();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
