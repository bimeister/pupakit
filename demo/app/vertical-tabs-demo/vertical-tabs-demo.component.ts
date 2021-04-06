import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { guidGenerate } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { Uuid } from '../../../src/internal/declarations/types/uuid.type';

export interface MockCheckModel {
  isEnabled: boolean;
  attachedCheckLists: number;
  timesPassed: number;
  name: string;
  createdBy: string;
  id: Uuid;
}

const MOCK_CHECKS: MockCheckModel[] = Array(100)
  .fill(undefined)
  .map((_, index: number) => ({
    isEnabled: [true, false][Math.round(Math.random())],
    attachedCheckLists: Math.round(Math.random() * 10),
    timesPassed: Math.round(Math.random() * 10),
    name: `some check ${index + 1}`,
    createdBy: 'admin admin',
    id: guidGenerate()
  }));

@Component({
  selector: 'demo-vertical-tabs',
  templateUrl: './vertical-tabs-demo.component.html',
  styleUrls: ['./vertical-tabs-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class VerticalTabsDemoComponent {
  public readonly checks: MockCheckModel[] = MOCK_CHECKS;

  public readonly activeValues$: BehaviorSubject<unknown[]> = new BehaviorSubject<unknown[]>([this.checks[0].id]);

  public handleTabSelection(values: unknown[]): void {
    this.activeValues$.next(values);
  }

  public tabIsActive(value: unknown, activeValues: unknown[]): boolean {
    return activeValues.includes(value);
  }
}
