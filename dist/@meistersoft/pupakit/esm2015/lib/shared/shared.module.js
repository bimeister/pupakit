import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from './components/input/input.component';
import { IsNullOrUndefinedPipe } from './pipes/is-null-or-undefined.pipe';
const SHARED_COMPONENTS = [InputComponent];
const SHARED_PIPES = [IsNullOrUndefinedPipe];
const SHARED_MODULES = [CommonModule, FormsModule];
export class SharedModule {
}
SharedModule.decorators = [
    { type: NgModule, args: [{
                declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
                imports: [...SHARED_MODULES],
                exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9zaGFyZWQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7TUFFcEUsaUJBQWlCLEdBQVUsQ0FBQyxjQUFjLENBQUM7TUFDM0MsWUFBWSxHQUFVLENBQUMscUJBQXFCLENBQUM7TUFDN0MsY0FBYyxHQUFVLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQztBQU96RCxNQUFNLE9BQU8sWUFBWTs7O1lBTHhCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixFQUFFLEdBQUcsWUFBWSxDQUFDO2dCQUNyRCxPQUFPLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLENBQUMsR0FBRyxjQUFjLEVBQUUsR0FBRyxpQkFBaUIsRUFBRSxHQUFHLFlBQVksQ0FBQzthQUNwRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2lucHV0L2lucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJc051bGxPclVuZGVmaW5lZFBpcGUgfSBmcm9tICcuL3BpcGVzL2lzLW51bGwtb3ItdW5kZWZpbmVkLnBpcGUnO1xuXG5jb25zdCBTSEFSRURfQ09NUE9ORU5UUzogYW55W10gPSBbSW5wdXRDb21wb25lbnRdO1xuY29uc3QgU0hBUkVEX1BJUEVTOiBhbnlbXSA9IFtJc051bGxPclVuZGVmaW5lZFBpcGVdO1xuY29uc3QgU0hBUkVEX01PRFVMRVM6IGFueVtdID0gW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFsuLi5TSEFSRURfQ09NUE9ORU5UUywgLi4uU0hBUkVEX1BJUEVTXSxcbiAgaW1wb3J0czogWy4uLlNIQVJFRF9NT0RVTEVTXSxcbiAgZXhwb3J0czogWy4uLlNIQVJFRF9NT0RVTEVTLCAuLi5TSEFSRURfQ09NUE9ORU5UUywgLi4uU0hBUkVEX1BJUEVTXVxufSlcbmV4cG9ydCBjbGFzcyBTaGFyZWRNb2R1bGUge31cbiJdfQ==