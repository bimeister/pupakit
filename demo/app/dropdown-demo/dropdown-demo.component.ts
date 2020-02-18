import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { DropdownItem } from './../../../src/internal';

@Component({
  selector: 'demo-dropdown',
  styleUrls: ['../demo.scss', './dropdown-demo.component.scss'],
  templateUrl: './dropdown-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DropdownDemoComponent {
  public positionChange$: Subject<void> = new Subject<void>();

  private detect: boolean = false;

  public open: boolean = false;
  public lorems: string[] = `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
  Beatae cum cupiditate eos ex facilis, fuga fugiat modi natus nisi obcaecati possimus reprehenderit.
  Animi deleniti illo modi officia rem sapiente! Sint!`.split(' ');

  public icons: string[] = ['airplane', 'add', 'arrow-forward'];

  public items: DropdownItem<string>[] = this.lorems.map((lorem: string, index: number) => ({
    caption: lorem,
    data: lorem,
    iconLeft: {
      name: this.icons[index % this.icons.length],
      color: getRandomColor()
    },
    iconRight: {
      name: this.icons[(index + 1) % this.icons.length],
      color: getRandomColor()
    }
  }));

  public onMousedown(): void {
    this.detect = true;
  }

  @HostListener('window:mouseup')
  public stopDetect(): void {
    this.detect = false;
  }

  @HostListener('window:mousemove')
  public checkPos(): void {
    if (!this.detect) {
      return;
    }
    this.positionChange$.next();
  }
}

function getRandomColor(): string {
  const letters: string = '0123456789ABCDEF';
  let color: string = '#';
  const six: number = 6;
  const sixteen: number = 16;
  for (let i: number = 0; i < six; i++) {
    color += letters[Math.floor(Math.random() * sixteen)];
  }
  return color;
}
