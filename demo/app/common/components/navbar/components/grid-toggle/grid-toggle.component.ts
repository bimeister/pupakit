import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GridStateService } from '../../../../../../../src/internal/shared/services/grid-state.service';

@Component({
  selector: 'demo-grid-toggle',
  templateUrl: './grid-toggle.component.html',
  styleUrls: ['./grid-toggle.component.scss']
})
export class GridToggleComponent implements OnDestroy {
  @Input() public label: string = '';
  public readonly gridVisibleFormControl: FormControl = new FormControl(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly gridStateService: GridStateService) {
    this.subscription.add(this.processGridVisibleStateControlChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processGridVisibleStateControlChanges(): Subscription {
    return this.gridVisibleFormControl.valueChanges.subscribe(() => this.gridStateService.toggleGridVisibleState());
  }
}
