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

    var CORE_COMPONENTS = [LayoutComponent];
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

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=meistersoft-pupakit.umd.js.map
