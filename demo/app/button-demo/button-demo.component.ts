import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'demo-button',
  styleUrls: ['../demo.scss'],
  templateUrl: './button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonDemoComponent {

  public isLoaderVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public combos: any[] = combos({
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

  public showLoader(): void {
    if (this.isLoaderVisible$.value) {
      return;
    }
    const delay: number = 3000;
    this.isLoaderVisible$.next(true);
    setTimeout(() => {
      this.isLoaderVisible$.next(false);
    }, delay);
  }

}
