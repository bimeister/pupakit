import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pupa-time-input-demo',
  templateUrl: './time-input-demo.component.html',
  styleUrls: ['./time-input-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeInputDemoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
