import {
  AfterContentInit,
  Directive,
  OnChanges,
  OnDestroy,
  QueryList,
  TemplateRef,
  TrackByFunction
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { TabsItemContentTemplateDirective } from '../../../../lib/components/tabs/directives/tabs-item-content-template.directive';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { TabsServiceBase } from './tabs-service-base.abstract';

interface TabTempalteRef {
  templateRef: TemplateRef<unknown>;
  name: string;
  isActive: boolean;
}

@Directive()
export abstract class TabsContentBase<S extends TabsServiceBase> implements OnChanges, AfterContentInit, OnDestroy {
  protected readonly subscription: Subscription = new Subscription();

  public abstract destroyable: boolean;
  protected readonly destroyable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public abstract tabTemplates: QueryList<TabsItemContentTemplateDirective>;

  protected readonly activeTabName$: Observable<string> = this.stateService.activeTabName$.pipe(filterNotNil());

  public readonly activeTemplateRef$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);
  public readonly nonDestroyableTemplateRefs$: BehaviorSubject<TabTempalteRef[]> = new BehaviorSubject<
    TabTempalteRef[]
  >([]);

  constructor(protected readonly stateService: S) {}

  public readonly tabTrackBy: TrackByFunction<TabTempalteRef> = (index: number) => index;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processInputDestroyableChanges(changes.destroyable?.currentValue);
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.processActiveTabChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processInputDestroyableChanges(destroyable: Nullable<boolean>): void {
    if (isNil(destroyable)) {
      return;
    }

    this.destroyable$.next(destroyable);
  }

  private processActiveTabChanges(): Subscription {
    return combineLatest([this.destroyable$, this.activeTabName$]).subscribe(
      ([destroyable, activeTabName]: [boolean, string]) => {
        if (destroyable) {
          const targetTemplate: TabsItemContentTemplateDirective = this.tabTemplates.find(
            (template: TabsItemContentTemplateDirective) => template.pupaTabsItemContentTemplate === activeTabName
          );
          this.activeTemplateRef$.next(targetTemplate.templateRef);
          return;
        }

        const templates: TabTempalteRef[] = this.tabTemplates.map((template: TabsItemContentTemplateDirective) => {
          return {
            templateRef: template.templateRef,
            name: template.pupaTabsItemContentTemplate,
            isActive: template.pupaTabsItemContentTemplate === activeTabName
          };
        });

        this.nonDestroyableTemplateRefs$.next(templates);
      }
    );
  }
}
