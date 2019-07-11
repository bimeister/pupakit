import { Component } from '@angular/core';
var LayoutComponent = (function () {
    function LayoutComponent() {
    }
    LayoutComponent.prototype.ngOnInit = function () { };
    LayoutComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pupa-layout',
                    template: "<ng-content></ng-content>\n",
                    styles: [":host{width:100%}"]
                }] }
    ];
    LayoutComponent.ctorParameters = function () { return []; };
    return LayoutComponent;
}());
export { LayoutComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRWxEO0lBTUU7SUFBZSxDQUFDO0lBRVQsa0NBQVEsR0FBZixjQUFtQixDQUFDOztnQkFSckIsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2Qix1Q0FBc0M7O2lCQUV2Qzs7O0lBS0Qsc0JBQUM7Q0FBQSxBQVRELElBU0M7U0FKWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncHVwYS1sYXlvdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vbGF5b3V0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbGF5b3V0LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTGF5b3V0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHt9XG59XG4iXX0=