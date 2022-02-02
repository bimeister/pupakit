import { Component, Input } from '@angular/core';
import { GridStateService } from '../../../../../../../../src/internal/shared/services/grid-state.service';

@Component({
  selector: 'demo-grid-toggle',
  templateUrl: './grid-toggle.component.html',
  styleUrls: ['./grid-toggle.component.scss'],
})
export class GridToggleComponent {
  @Input() public label: string = '';
  public readonly isGridVisible: boolean = false;

  constructor(private readonly gridStateService: GridStateService) {}

  public toggleGridVisible(): void {
    this.gridStateService.toggleGridVisibleState();
  }
}
