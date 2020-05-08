import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pupa-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
