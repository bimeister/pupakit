import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { VISUALIZATION_COLORS, VisualizationColors } from '@bimeister/pupakit.common';

@Component({
  selector: 'demo-visualization-color-usage-example-2',
  templateUrl: './visualization-color-usage-example-2.component.html',
  styleUrls: ['./visualization-color-usage-example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsVisualizationColorUsageExample2Component {
  public visualizationColors: VisualizationColors = VISUALIZATION_COLORS;
}
