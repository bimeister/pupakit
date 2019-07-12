import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title: string = 'Pupa kit';

  public log(...data: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
