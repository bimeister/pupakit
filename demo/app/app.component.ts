// tslint:disable
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import combos from 'combos';
import { Subscription } from 'rxjs';

interface ComponentPropertyValues {
  [propertyName: string]: unknown[];
}

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'Pupa kit';
  public sampleFormControl: FormControl = new FormControl('formControl', Validators.required);

  public buttonCombos: any[] = combos({
    type: ['solid', 'outlined', 'link'],
    color: ['normal', 'negative', 'positive', 'alert'],
    size: ['large', 'medium', 'small'],
    disabled: [false, true],
    icon: [
      null,
      {
        name: 'checkmark-circle',
        position: 'left'
      },
      {
        name: 'add-circle',
        position: 'right'
      }
    ]
  });

  public inputCombos: any[] = combos({
    size: ['medium', 'small'],
    placeholder: ['placeholder'],
    disabled: [false, true],
    type: ['text', 'password']
  });

  public checkboxCombos: any[] = combos({
    value: [true, null, false],
    disabled: [false, true]
  });

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.sampleFormControl.valueChanges.subscribe(console.log));
  }

  public getCombos(propertyValues: ComponentPropertyValues): any[] {
    return combos(propertyValues);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public log(...data: unknown[]): void {
    console.log(...data);
  }
}
