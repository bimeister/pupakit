import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pupa-modal-layout-title',
  templateUrl: './modal-layout-title.component.html',
  styleUrls: ['./modal-layout-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutTitleComponent implements AfterContentInit {
  @ViewChild('title', { static: true }) public title: ElementRef<HTMLElement>;

  public readonly isTooltipDisabled$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public readonly titleText$: BehaviorSubject<string> = new BehaviorSubject('');

  public ngAfterContentInit(): void {
    this.titleText$.next(this.title.nativeElement.innerText);
  }
}
