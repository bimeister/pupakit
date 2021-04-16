import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PropsCheckboxComponent } from '../example-viewer/props-checkbox/props-checkbox.component';

const MAX_LABEL_STRING_LENGTH: number = 21;
const MAX_HINT_STRING_LENGTH: number = 25;

@Component({
  selector: 'demo-checkbox',
  templateUrl: './checkbox-demo.component.html',
  styleUrls: ['./checkbox-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxDemoComponent implements AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly control: FormControl = new FormControl(false);
  public label: string = 'Очень большое название чего-либо';
  public hint: string = 'Очень большое описание чего-либо';

  @ViewChild('disabled', { static: false }) public readonly disabledCheckBoxComponent: PropsCheckboxComponent;

  public ngAfterViewInit(): void {
    this.subscription.add(this.processControlValueChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public isNeedDisplayTooltip(): boolean {
    return MAX_LABEL_STRING_LENGTH < this.label.length || MAX_HINT_STRING_LENGTH < this.hint.length;
  }

  private processControlValueChanges(): Subscription {
    const sourceControl: FormControl = this.disabledCheckBoxComponent.control;

    return sourceControl.valueChanges.subscribe((value: boolean) => {
      value ? this.control.disable() : this.control.enable();
    });
  }
}
