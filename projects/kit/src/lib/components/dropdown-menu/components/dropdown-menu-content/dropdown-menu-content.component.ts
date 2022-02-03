import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';
import { DropdownContextService } from '../../services/dropdown-context.service';

type ContentTemplate = Nullable<TemplateRef<unknown>>;

const DEFAULT_POSITION: HorizontalConnectionPos = 'center';

@Component({
  selector: 'pupa-dropdown-menu-content',
  templateUrl: './dropdown-menu-content.component.html',
  styleUrls: ['./dropdown-menu-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DropdownContextService],
})
export class DropdownMenuContentComponent implements OnChanges, AfterViewInit {
  @Input() public horizontalPosition: HorizontalConnectionPos = DEFAULT_POSITION;
  private readonly horizontalPositionState$: BehaviorSubject<HorizontalConnectionPos> = new BehaviorSubject(
    DEFAULT_POSITION
  );
  public readonly horizontalPosition$: Observable<HorizontalConnectionPos> = this.horizontalPositionState$.pipe(
    distinctUntilChanged()
  );

  public readonly contextId: Uuid = this.dropdownContextService.contextId;

  public readonly themeClass$: Observable<string> = this.themeWrapperService?.themeClass$ ?? of('');

  @ViewChild('contentTemplate') private readonly dropdownMenuContentTemplate: ContentTemplate;
  private readonly contentTemplateState$: BehaviorSubject<ContentTemplate> = new BehaviorSubject<ContentTemplate>(null);
  public readonly contentTemplate$: Observable<ContentTemplate> = this.contentTemplateState$
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    private readonly dropdownContextService: DropdownContextService,
    @Optional() private readonly themeWrapperService?: ThemeWrapperService
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processHorizontalPositionChange(changes?.horizontalPosition);
  }

  public ngAfterViewInit(): void {
    this.contentTemplateState$.next(this.dropdownMenuContentTemplate);
  }

  private processHorizontalPositionChange(change: ComponentChange<this, HorizontalConnectionPos>): void {
    const newValue: HorizontalConnectionPos | undefined = change?.currentValue;

    if (isNil(newValue)) {
      return;
    }

    this.horizontalPositionState$.next(newValue);
  }
}
