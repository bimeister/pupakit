(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('src/lib/helpers/is-null-or-undefined.helper')) :
    typeof define === 'function' && define.amd ? define('@meistersoft/pupakit', ['exports', '@angular/core', '@angular/common', '@angular/forms', 'src/lib/helpers/is-null-or-undefined.helper'], factory) :
    (global = global || self, factory((global.meistersoft = global.meistersoft || {}, global.meistersoft.pupakit = {}), global.ng.core, global.ng.common, global.ng.forms, global.isNullOrUndefined_helper));
}(this, function (exports, core, common, forms, isNullOrUndefined_helper) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var InputComponent = (function () {
        function InputComponent() {
        }
        InputComponent.decorators = [
            { type: core.Component, args: [{
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
            return isNullOrUndefined_helper.isNullOrUndefined(entity);
        };
        IsNullOrUndefinedPipe.decorators = [
            { type: core.Pipe, args: [{
                        name: 'isNullOrUndefined'
                    },] }
        ];
        return IsNullOrUndefinedPipe;
    }());

    var SHARED_COMPONENTS = [InputComponent];
    var SHARED_PIPES = [IsNullOrUndefinedPipe];
    var SHARED_MODULES = [common.CommonModule, forms.FormsModule];
    var SharedModule = (function () {
        function SharedModule() {
        }
        SharedModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: __spread(SHARED_COMPONENTS, SHARED_PIPES),
                        imports: __spread(SHARED_MODULES),
                        exports: __spread(SHARED_MODULES, SHARED_COMPONENTS, SHARED_PIPES)
                    },] }
        ];
        return SharedModule;
    }());

    var ButtonComponent = (function () {
        function ButtonComponent() {
            this.type = 'solid';
            this.size = 'medium';
            this.color = 'normal';
        }
        ButtonComponent.prototype.getResultClassList = function (prefix) {
            return [this.type, this.size, this.color].map((function (innerProperty) { return "" + prefix + innerProperty; }));
        };
        ButtonComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'pupa-button',
                        template: "<button class=\"button\" [ngClass]=\"getResultClassList('button_')\">\n  <span class=\"button__text\">\n    <ng-content></ng-content>\n  </span>\n</button>\n",
                        styles: [".button{box-sizing:border-box;font-family:effra;cursor:pointer;padding:0;display:inline-flex;flex-direction:row;align-items:center;justify-content:space-evenly;flex-wrap:nowrap}.button_large{min-width:7rem;height:2.5rem;border-radius:1rem;padding:.625rem .8125rem}.button_large .button__text{font-size:1rem;font-weight:500;line-height:1}.button_medium{min-width:7rem;height:2rem;border-radius:.875rem;padding:.375rem 1rem}.button_medium .button__text{font-size:1rem;font-weight:500;line-height:1}.button_small{min-width:4rem;height:1.5rem;border-radius:.5rem;padding:.1875rem .625rem}.button_small .button__text{font-size:.875rem;font-weight:400;line-height:1.14}.button_solid.button_normal{border:none;background:#0a0d65}.button_solid.button_normal .button__text{color:#fff}.button_solid.button_negative{border:none;background:red}.button_solid.button_negative .button__text{color:#fff}.button_solid.button_positive{border:none;background:#00c902}.button_solid.button_positive .button__text{color:#fff}.button_solid.button_alert{border:none;background:#ffc009}.button_solid.button_alert .button__text{color:#fff}.button_outlined.button_normal{border:.0625rem solid #0a0d65;background:#fff}.button_outlined.button_normal .button__text{color:#0a0d65}.button_outlined.button_negative{border:.0625rem solid red;background:#fff}.button_outlined.button_negative .button__text{color:#202020}.button_outlined.button_positive{border:.0625rem solid #00c902;background:#fff}.button_outlined.button_positive .button__text{color:#202020}.button_outlined.button_alert{border:.0625rem solid #ffc009;background:#fff}.button_outlined.button_alert .button__text{color:#202020}.button_link{border:none;background:#fff}.button_link .button__text{color:#0a0d65}"]
                    }] }
        ];
        ButtonComponent.propDecorators = {
            type: [{ type: core.Input }],
            size: [{ type: core.Input }],
            color: [{ type: core.Input }]
        };
        return ButtonComponent;
    }());

    var LayoutComponent = (function () {
        function LayoutComponent() {
        }
        LayoutComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'pupa-layout',
                        template: "<ng-content></ng-content>\n",
                        styles: [":host{width:100%}"]
                    }] }
        ];
        return LayoutComponent;
    }());

    var CORE_COMPONENTS = [LayoutComponent, ButtonComponent];
    var PupakitCore = (function () {
        function PupakitCore() {
        }
        PupakitCore.decorators = [
            { type: core.NgModule, args: [{
                        imports: [SharedModule],
                        declarations: __spread(CORE_COMPONENTS),
                        exports: __spread([SharedModule], CORE_COMPONENTS)
                    },] }
        ];
        return PupakitCore;
    }());

    exports.PupakitCore = PupakitCore;
    exports.ɵa = SharedModule;
    exports.ɵb = InputComponent;
    exports.ɵc = IsNullOrUndefinedPipe;
    exports.ɵd = LayoutComponent;
    exports.ɵe = ButtonComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=meistersoft-pupakit.umd.js.map
