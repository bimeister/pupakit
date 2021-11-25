import {
  AfterContentInit,
  Directive,
  OnChanges,
  OnDestroy,
  QueryList,
  TemplateRef,
  TrackByFunction
} from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { ContentTemplateNameDirective } from '../../interfaces/content-template-name.interface';
import { TabTemplateRef } from '../../interfaces/tab-template-ref.interface';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsContentBase<S extends TabsServiceBase> implements OnChanges, AfterContentInit, OnDestroy {
  protected readonly subscription: Subscription = new Subscription();

  public abstract destroyable: boolean;
  protected readonly destroyable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public abstract tabTemplates: QueryList<ContentTemplateNameDirective>;

  protected readonly activeTabName$: Observable<string> = this.stateService.activeTabName$.pipe(filterNotNil());

  public readonly activeTemplateRef$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);
  public readonly nonDestroyableTemplateRefs$: BehaviorSubject<TabTemplateRef[]> = new BehaviorSubject<
    TabTemplateRef[]
  >([]);

  constructor(protected readonly stateService: S) {}

  public readonly tabTrackBy: TrackByFunction<TabTemplateRef> = (index: number) => index;

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
          const targetTemplate: ContentTemplateNameDirective = this.tabTemplates.find(
            (template: ContentTemplateNameDirective) => template.getTemplateName() === activeTabName
          );
          this.activeTemplateRef$.next(targetTemplate.templateRef);
          return;
        }

        const templates: TabTemplateRef[] = this.tabTemplates.map((template: ContentTemplateNameDirective) => {
          return {
            templateRef: template.templateRef,
            name: template.getTemplateName(),
            isActive: template.getTemplateName() === activeTabName
          };
        });

        this.nonDestroyableTemplateRefs$.next(templates);
      }
    );
  }
}
