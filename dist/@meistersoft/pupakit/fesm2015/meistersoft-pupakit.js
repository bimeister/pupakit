import { Component, Pipe, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isNullOrUndefined } from 'src/lib/helpers/is-null-or-undefined.helper';

class InputComponent {
}
InputComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-input',
                template: "input-works\n",
                styles: [""]
            }] }
];

class IsNullOrUndefinedPipe {
    transform(entity) {
        return isNullOrUndefined(entity);
    }
}
IsNullOrUndefinedPipe.decorators = [
    { type: Pipe, args: [{
                name: 'isNullOrUndefined'
            },] }
];

const SHARED_COMPONENTS = [InputComponent];
const SHARED_PIPES = [IsNullOrUndefinedPipe];
const SHARED_MODULES = [CommonModule, FormsModule];
class SharedModule {
}
SharedModule.decorators = [
    { type: NgModule, args: [{
                declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
                imports: [...SHARED_MODULES],
                exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES]
            },] }
];

class LayoutComponent {
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

const CORE_COMPONENTS = [LayoutComponent];
class PupakitCore {
}
PupakitCore.decorators = [
    { type: NgModule, args: [{
                imports: [SharedModule],
                declarations: [...CORE_COMPONENTS],
                exports: [SharedModule, ...CORE_COMPONENTS]
            },] }
];

export { PupakitCore, SharedModule as ɵa, InputComponent as ɵb, IsNullOrUndefinedPipe as ɵc, LayoutComponent as ɵd };
//# sourceMappingURL=meistersoft-pupakit.js.map
