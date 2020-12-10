import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectTabsService } from '../../../services/select-tabs-state.service';

@Component({
  selector: 'pupa-select-tabs',
  templateUrl: './select-tabs.component.html',
  styleUrls: ['./select-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectTabsService]
})
export class SelectTabsComponent<T> implements OnInit, OnDestroy {
  @Input() public readonly initialSelect: T;
  @Output() public readonly selectChange: EventEmitter<T> = new EventEmitter();
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly selectTabsService: SelectTabsService<T>) {}

  public ngOnInit(): void {
    this.subscription.add(this.processCurrentValueChange());
    this.selectTabsService.currentValue$.next(this.initialSelect);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processCurrentValueChange(): Subscription {
    return this.selectTabsService.currentValue$.subscribe((value: T) => this.selectChange.emit(value));
  }
}
