import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { stringFilterPredicate } from '@bimeister/utilities';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'demo-search-field-demo-example-basic',
  templateUrl: './search-field-demo-example-basic.component.html',
  styleUrls: ['./search-field-demo-example-basic.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldDemoExampleBasicComponent {
  public readonly searchControl: FormControl = new FormControl('');

  private readonly fruits$: Observable<string[]> = of([
    '🍎 apple',
    '🍌 banana',
    '🍇 grapes',
    '🍍 pineapple',
    '🍑 peach',
    '🍉 watermelon',
  ]);

  public readonly filteredFruitList$: Observable<string[]> = combineLatest([
    this.fruits$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([fruits, query]: [string[], string]) => fruits.filter((fruit: string) => stringFilterPredicate(fruit, query)))
  );
}
