import { Directive, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { shareReplayWithRefCount } from '@bimeister/utilities/commonjs/rxjs';
import { Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive()
export abstract class SelectSearchBase implements OnInit, OnDestroy {
  public abstract placeholder: string = '';
  public abstract readonly query: EventEmitter<string> = new EventEmitter<string>();

  public readonly control: FormControl = new FormControl('');

  public readonly query$: Observable<string> = this.control.valueChanges.pipe(startWith(''), shareReplayWithRefCount());

  private readonly subscription: Subscription = new Subscription();

  protected processDomEvent(event: Event): void {
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this.subscription.add(this.processInput());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public resetQuery(): void {
    this.control.setValue('');
  }

  private processInput(): Subscription {
    return this.query$.subscribe((query: string) => this.query.emit(query));
  }
}
