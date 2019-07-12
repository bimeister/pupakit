import { Component, Pipe, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class InputComponent {
}
InputComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-input',
                template: "input-works\n",
                styles: [""]
            }] }
];

const isNullOrUndefined = ((entity) => {
    return entity === null || entity === undefined;
});

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

class ButtonComponent {
    constructor() {
        this.type = 'solid';
        this.size = 'medium';
        this.color = 'normal';
    }
    getResultClassList(prefix) {
        return [this.type, this.size, this.color].map(((innerProperty) => `${prefix}${innerProperty}`));
    }
}
ButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-button',
                template: "<button class=\"button\" [ngClass]=\"getResultClassList('button_')\">\n  <span class=\"button__text\">\n    <ng-content></ng-content>\n  </span>\n</button>\n",
                styles: [".button{box-sizing:border-box;font-family:effra;cursor:pointer;padding:0;display:inline-flex;flex-direction:row;align-items:center;justify-content:space-evenly;flex-wrap:nowrap}.button_large{min-width:7rem;height:2.5rem;border-radius:1rem;padding:.625rem .8125rem}.button_large .button__text{font-size:1rem;font-weight:500;line-height:1}.button_medium{min-width:7rem;height:2rem;border-radius:.875rem;padding:.375rem 1rem}.button_medium .button__text{font-size:1rem;font-weight:500;line-height:1}.button_small{min-width:4rem;height:1.5rem;border-radius:.5rem;padding:.1875rem .625rem}.button_small .button__text{font-size:.875rem;font-weight:400;line-height:1.14}.button_solid.button_normal{border:none;background:#0a0d65}.button_solid.button_normal .button__text{color:#fff}.button_solid.button_negative{border:none;background:red}.button_solid.button_negative .button__text{color:#fff}.button_solid.button_positive{border:none;background:#00c902}.button_solid.button_positive .button__text{color:#fff}.button_solid.button_alert{border:none;background:#ffc009}.button_solid.button_alert .button__text{color:#fff}.button_outlined.button_normal{border:.0625rem solid #0a0d65;background:#fff}.button_outlined.button_normal .button__text{color:#0a0d65}.button_outlined.button_negative{border:.0625rem solid red;background:#fff}.button_outlined.button_negative .button__text{color:#202020}.button_outlined.button_positive{border:.0625rem solid #00c902;background:#fff}.button_outlined.button_positive .button__text{color:#202020}.button_outlined.button_alert{border:.0625rem solid #ffc009;background:#fff}.button_outlined.button_alert .button__text{color:#202020}.button_link{border:none;background:#fff}.button_link .button__text{color:#0a0d65}"]
            }] }
];
ButtonComponent.propDecorators = {
    type: [{ type: Input }],
    size: [{ type: Input }],
    color: [{ type: Input }]
};

class LayoutComponent {
}
LayoutComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-layout',
                template: "<ng-content></ng-content>\n",
                styles: [":host{width:100%}"]
            }] }
];

const CORE_COMPONENTS = [LayoutComponent, ButtonComponent];
class PupakitCore {
}
PupakitCore.decorators = [
    { type: NgModule, args: [{
                imports: [SharedModule],
                declarations: [...CORE_COMPONENTS],
                exports: [SharedModule, ...CORE_COMPONENTS]
            },] }
];

export { PupakitCore, SharedModule as ɵa, InputComponent as ɵb, IsNullOrUndefinedPipe as ɵc, LayoutComponent as ɵd, ButtonComponent as ɵe };
//# sourceMappingURL=meistersoft-pupakit.js.map
