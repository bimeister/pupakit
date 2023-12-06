import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { TagKind } from '@bimeister/pupakit.kit';
import { BehaviorSubject } from 'rxjs';
import { SelectTriggerBase } from '../../../../declarations/classes/abstract/select-trigger-base.abstract';
import { SelectStateService } from '../../services/select-state.service';

@Component({
  selector: 'pupa-select-trigger-tag',
  templateUrl: './select-trigger-tag.component.html',
  styleUrls: ['./select-trigger-tag.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerTagComponent<T> extends SelectTriggerBase<T> {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true, read: ElementRef }) protected readonly button: ElementRef<HTMLElement>;

  @Input() public clickable: boolean = false;
  @Input() public kind: TagKind = 'opacity';

  public isDisabled$: BehaviorSubject<boolean> = this.selectStateService.isDisabled$;
  public isExpanded$: BehaviorSubject<boolean> = this.selectStateService.isExpanded$;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
