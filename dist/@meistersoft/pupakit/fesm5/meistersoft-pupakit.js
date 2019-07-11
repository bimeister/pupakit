import { __spread } from 'tslib';
import { Component, Pipe, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isNullOrUndefined } from 'src/lib/helpers/is-null-or-undefined.helper';

var InputComponent = (function () {
    function InputComponent() {
    }
    InputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pupa-input',
                    template: "input-works\n",
                    styles: [""]
                }] }
    ];
    return InputComponent;
}());

var IsNullOrUndefinedPipe = (function () {
    function IsNullOrUndefinedPipe() {
    }
    IsNullOrUndefinedPipe.prototype.transform = function (entity) {
        return isNullOrUndefined(entity);
    };
    IsNullOrUndefinedPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'isNullOrUndefined'
                },] }
    ];
    return IsNullOrUndefinedPipe;
}());

var SHARED_COMPONENTS = [InputComponent];
var SHARED_PIPES = [IsNullOrUndefinedPipe];
var SHARED_MODULES = [CommonModule, FormsModule];
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule.decorators = [
        { type: NgModule, args: [{
                    declarations: __spread(SHARED_COMPONENTS, SHARED_PIPES),
                    imports: __spread(SHARED_MODULES),
                    exports: __spread(SHARED_MODULES, SHARED_COMPONENTS, SHARED_PIPES)
                },] }
    ];
    return SharedModule;
}());

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

var CORE_COMPONENTS = [LayoutComponent];
var PupakitCore = (function () {
    function PupakitCore() {
    }
    PupakitCore.decorators = [
        { type: NgModule, args: [{
                    imports: [SharedModule],
                    declarations: __spread(CORE_COMPONENTS),
                    exports: __spread([SharedModule], CORE_COMPONENTS)
                },] }
    ];
    return PupakitCore;
}());

export { PupakitCore, SharedModule as ɵa, InputComponent as ɵb, IsNullOrUndefinedPipe as ɵc, LayoutComponent as ɵd };
//# sourceMappingURL=meistersoft-pupakit.js.map
