import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { isEmpty, isNil } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { PropsSwitcherComponent } from '../props-switcher/props-switcher.component';

@Component({
  selector: 'demo-props-form-control-validators',
  templateUrl: './props-form-control-validators.component.html',
  styleUrls: ['./props-form-control-validators.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropsFormControlValidatorsComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(PropsSwitcherComponent)
  private readonly propsSwitcher: PropsSwitcherComponent;
  private readonly subscription: Subscription = new Subscription();

  @Input() public initialValue: boolean = false;

  @Input()
  public controlsList: FormControl[] = [];

  @Input()
  public validators: ValidatorFn[] = [];

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.propsSwitcher.subscribe((attachValidator: boolean) => {
        if (isEmpty(this.controlsList)) {
          return;
        }

        if (attachValidator) {
          this.controlsList.forEach((control: AbstractControl) => control.setValidators(this.validators));
        } else {
          this.controlsList.forEach((control: AbstractControl) => control.clearValidators());
        }

        this.controlsList.forEach((control: AbstractControl) => control.updateValueAndValidity());
      })
    );
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (!isNil(changes.validators)) {
      this.controlsList.forEach((control: AbstractControl) => {
        control.clearValidators();
        control.setValidators(this.validators);
        control.updateValueAndValidity();
      });
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
