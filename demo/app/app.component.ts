import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public title: string = 'Pupa kit';
  public sampleFormControl: FormControl = new FormControl('formControl');
  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    // tslint:disable-next-line: no-console  no-unbound-method
    this.subscription.add(this.sampleFormControl.valueChanges.subscribe(console.log));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public log(...data: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
