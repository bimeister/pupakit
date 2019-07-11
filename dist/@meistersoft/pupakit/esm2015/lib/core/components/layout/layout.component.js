import { Component } from '@angular/core';
export class LayoutComponent {
    constructor() { }
    ngOnInit() { }
}
LayoutComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-layout',
                template: "<ng-content></ng-content>\n",
                styles: [":host{width:100%}"]
            }] }
];
LayoutComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBT2xELE1BQU0sT0FBTyxlQUFlO0lBQzFCLGdCQUFlLENBQUM7SUFFVCxRQUFRLEtBQUksQ0FBQzs7O1lBUnJCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsdUNBQXNDOzthQUV2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3B1cGEtbGF5b3V0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2xheW91dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2xheW91dC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIExheW91dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7fVxufVxuIl19