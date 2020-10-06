import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { shareReplayWithRefCount } from '@meistersoft/utilities';
import { Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'pupa-select-new-search',
  templateUrl: './select-new-search.component.html',
  styleUrls: ['./select-new-search.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewSearchComponent implements OnInit, OnDestroy {
  @Input() public placeholder: string = '';
  @Output() public readonly query: EventEmitter<string> = new EventEmitter<string>();

  public readonly control: FormControl = new FormControl('');

  public readonly query$: Observable<string> = this.control.valueChanges.pipe(startWith(''), shareReplayWithRefCount());

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.processInput());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  public processClick(event: Event): void {
    event.stopPropagation();
  }

  public resetQuery(): void {
    this.control.setValue('');
  }

  private processInput(): Subscription {
    return this.query$.subscribe((query: string) => this.query.emit(query));
  }
}
