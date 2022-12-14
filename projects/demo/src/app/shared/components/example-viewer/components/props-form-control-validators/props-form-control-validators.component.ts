import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { isEmpty } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { PropsSwitcherComponent } from '../props-switcher/props-switcher.component';

@Component({
  selector: 'demo-props-form-control-validators',
  templateUrl: './props-form-control-validators.component.html',
  styleUrls: ['./props-form-control-validators.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropsFormControlValidatorsComponent implements AfterViewInit, OnDestroy {
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
