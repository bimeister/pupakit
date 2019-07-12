import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { LayoutComponent } from './components/layout/layout.component';
const CORE_COMPONENTS = [LayoutComponent, ButtonComponent];
export class PupakitCore {
}
PupakitCore.decorators = [
    { type: NgModule, args: [{
                imports: [SharedModule],
                declarations: [...CORE_COMPONENTS],
                exports: [SharedModule, ...CORE_COMPONENTS]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVwYWtpdC1jb3JlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvcHVwYWtpdC1jb3JlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO01BRWpFLGVBQWUsR0FBVSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7QUFPakUsTUFBTSxPQUFPLFdBQVc7OztZQUx2QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixZQUFZLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQztnQkFDbEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsZUFBZSxDQUFDO2FBQzVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IExheW91dENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmNvbXBvbmVudCc7XG5cbmNvbnN0IENPUkVfQ09NUE9ORU5UUzogYW55W10gPSBbTGF5b3V0Q29tcG9uZW50LCBCdXR0b25Db21wb25lbnRdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbU2hhcmVkTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbLi4uQ09SRV9DT01QT05FTlRTXSxcbiAgZXhwb3J0czogW1NoYXJlZE1vZHVsZSwgLi4uQ09SRV9DT01QT05FTlRTXVxufSlcbmV4cG9ydCBjbGFzcyBQdXBha2l0Q29yZSB7fVxuIl19