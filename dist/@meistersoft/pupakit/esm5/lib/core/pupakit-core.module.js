import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './components/layout/layout.component';
var CORE_COMPONENTS = [LayoutComponent];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVwYWtpdC1jb3JlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvcHVwYWtpdC1jb3JlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0lBRWpFLGVBQWUsR0FBVSxDQUFDLGVBQWUsQ0FBQztBQUVoRDtJQUFBO0lBSzBCLENBQUM7O2dCQUwxQixRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixZQUFZLG1CQUFNLGVBQWUsQ0FBQztvQkFDbEMsT0FBTyxvQkFBRyxZQUFZLEdBQUssZUFBZSxDQUFDO2lCQUM1Qzs7SUFDeUIsa0JBQUM7Q0FBQSxBQUwzQixJQUsyQjtTQUFkLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBMYXlvdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC5jb21wb25lbnQnO1xuXG5jb25zdCBDT1JFX0NPTVBPTkVOVFM6IGFueVtdID0gW0xheW91dENvbXBvbmVudF07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtTaGFyZWRNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5DT1JFX0NPTVBPTkVOVFNdLFxuICBleHBvcnRzOiBbU2hhcmVkTW9kdWxlLCAuLi5DT1JFX0NPTVBPTkVOVFNdXG59KVxuZXhwb3J0IGNsYXNzIFB1cGFraXRDb3JlIHt9XG4iXX0=