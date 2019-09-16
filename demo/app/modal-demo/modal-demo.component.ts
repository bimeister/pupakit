import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalSize } from 'src/lib/core/components/modal/modal.component';

@Component({
  selector: 'demo-modal-demo',
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDemoComponent {
  public readonly visibleModal$: BehaviorSubject<ModalSize> = new BehaviorSubject<ModalSize>(null);
}
