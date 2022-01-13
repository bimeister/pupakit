import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

const BASE_REQUEST_PATH: string = 'timer-demo/examples';

@Component({
  selector: 'demo-timer-demo',
  templateUrl: './timer-demo.component.html',
  styleUrls: ['./timer-demo.component.scss'],
})
export class TimerDemoComponent {
  public readonly secondsControl: FormControl = new FormControl(10);

  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.html`,
  };
}
