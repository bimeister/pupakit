import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { stringFilterPredicate } from '@bimeister/utilities';
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'demo-search-field-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldExample1Component {
  public readonly searchControl: FormControl = new FormControl('');

  private readonly fruits$: Observable<string[]> = of([
    '🍎 apple',
    '🍌 banana',
    '🍇 grapes',
    '🍍 pineapple',
    '🍑 peach',
    '🍉 watermelon'
  ]);

  public readonly filteredFruitList$: Observable<string[]> = combineLatest([
    this.fruits$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([fruits, query]: [string[], string]) => {
      return fruits.filter((fruit: string) => stringFilterPredicate(fruit, query));
    })
  );
}
