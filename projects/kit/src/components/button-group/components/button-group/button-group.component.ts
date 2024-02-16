import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/button-group-state-service.token';
import { TabsBase } from '../../../../declarations/classes/abstract/tabs-base.abstract';
import { ButtonGroupStateService } from '../../services/button-group-state.service';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { ButtonGroupSize } from '../../../../declarations/types/button-group-size.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pupa-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ButtonGroupStateService],
})
export class ButtonGroupComponent<T> extends TabsBase<T, ButtonGroupStateService<T>> implements OnInit, OnChanges {
  @Input() public size: ButtonGroupSize = 'm';

  @ViewChild('buttonGroupContainer', { static: true })
  private readonly buttonGroupContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;

  @Output() public readonly activeTabNameChange: EventEmitter<T> = new EventEmitter<T>();

  public readonly sizeClass$: Observable<string> = this.stateService.buttonGroupSize$.pipe(
    map((size: ButtonGroupSize) => `pupa-button-group_${size}`)
  );

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: ButtonGroupStateService<T>,
    changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    @Optional()
    @Inject(BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN)
    fromContainerStateService?: ButtonGroupStateService<T>
  ) {
    super(stateService, changeDetectorRef, ngZone, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.buttonGroupContainerRef.nativeElement);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('size')) {
      this.processSizeChange(changes.size);
    }
  }

  private processSizeChange(size: ComponentChange<this, ButtonGroupSize>): void {
    this.stateService.setButtonGroupSize(size.currentValue);
  }
}
