import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import combos from 'combos';
import { Subscription } from 'rxjs';

interface ComponentPropertyValues {
  [propertyName: string]: unknown[];
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'Pupa kit';
  public sampleFormControl: FormControl = new FormControl('formControl');

  public buttonPropertyValues: ComponentPropertyValues = {
    type: ['solid', 'outlined', 'link'],
    color: ['normal', 'negative', 'positive', 'alert'],
    size: ['large', 'medium', 'small'],
    disabled: [false, true]
  };

  public inputPropertyValues: ComponentPropertyValues = {
    size: ['medium', 'small'],
    valid: [true, false, null],
    placeholder: ['placeholder'],
    disabled: [false, true],
    value: ['']
  };

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    // tslint:disable-next-line: no-console  no-unbound-method
    this.subscription.add(this.sampleFormControl.valueChanges.subscribe(console.log));
  }

  public getCombos(propertyValues: ComponentPropertyValues): any[] {
    return combos(propertyValues);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public log(...data: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
