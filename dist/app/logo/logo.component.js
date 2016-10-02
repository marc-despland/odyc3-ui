"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var LogoComponent = (function () {
    function LogoComponent() {
        this.onSelect = new core_1.EventEmitter();
    }
    LogoComponent.prototype.ngOnInit = function () {
    };
    LogoComponent.prototype.onClick = function () {
        this.onSelect.emit(this.id);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LogoComponent.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LogoComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LogoComponent.prototype, "logos", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LogoComponent.prototype, "onSelect", void 0);
    LogoComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'logo',
            templateUrl: 'logo.component.html',
            styleUrls: ['logo.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], LogoComponent);
    return LogoComponent;
}());
exports.LogoComponent = LogoComponent;
//# sourceMappingURL=logo.component.js.map