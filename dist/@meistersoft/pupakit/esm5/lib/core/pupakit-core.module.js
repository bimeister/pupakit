import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { LayoutComponent } from './components/layout/layout.component';
var CORE_COMPONENTS = [LayoutComponent, ButtonComponent];
var PupakitCore = (function () {
    function PupakitCore() {
    }
    PupakitCore.decorators = [
        { type: NgModule, args: [{
                    imports: [SharedModule],
                    declarations: tslib_1.__spread(CORE_COMPONENTS),
                    exports: tslib_1.__spread([SharedModule], CORE_COMPONENTS)
                },] }
    ];
    return PupakitCore;
}());
export { PupakitCore };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVwYWtpdC1jb3JlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvcHVwYWtpdC1jb3JlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztJQUVqRSxlQUFlLEdBQVUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO0FBRWpFO0lBQUE7SUFLMEIsQ0FBQzs7Z0JBTDFCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksbUJBQU0sZUFBZSxDQUFDO29CQUNsQyxPQUFPLG9CQUFHLFlBQVksR0FBSyxlQUFlLENBQUM7aUJBQzVDOztJQUN5QixrQkFBQztDQUFBLEFBTDNCLElBSzJCO1NBQWQsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFNoYXJlZE1vZHVsZSB9IGZyb20gJy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IEJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMYXlvdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC5jb21wb25lbnQnO1xuXG5jb25zdCBDT1JFX0NPTVBPTkVOVFM6IGFueVtdID0gW0xheW91dENvbXBvbmVudCwgQnV0dG9uQ29tcG9uZW50XTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1NoYXJlZE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogWy4uLkNPUkVfQ09NUE9ORU5UU10sXG4gIGV4cG9ydHM6IFtTaGFyZWRNb2R1bGUsIC4uLkNPUkVfQ09NUE9ORU5UU11cbn0pXG5leHBvcnQgY2xhc3MgUHVwYWtpdENvcmUge31cbiJdfQ==