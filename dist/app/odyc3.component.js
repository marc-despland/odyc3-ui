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
var logo_component_1 = require('./logo/logo.component');
var game_service_1 = require('./game.service');
var game_1 = require('./game');
var Odyc3AppComponent = (function () {
    function Odyc3AppComponent(gameService) {
        this.gameService = gameService;
        this.logosid = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.selected = -1;
        this.state = 1;
        this.email = "";
    }
    Odyc3AppComponent.prototype.onSelect = function (id) {
        if (this.selected == -1) {
            this.selected = id;
        }
        else {
            var tmp = this.logosid[id];
            this.logosid[id] = this.logosid[this.selected];
            this.logosid[this.selected] = tmp;
            this.selected = -1;
        }
    };
    Odyc3AppComponent.prototype.enterEmail = function () {
        this.state = 2;
    };
    Odyc3AppComponent.prototype.sendGame = function () {
        var _this = this;
        var game = new game_1.Game();
        game.email = this.email;
        game.play = this.logosid;
        console.log('Component will send the request');
        this.gameService.create(game).then(function (response) { return _this.receivedResponse(response); });
        this.state = 3;
    };
    Odyc3AppComponent.prototype.tryAgain = function () {
        this.state = 1;
    };
    Odyc3AppComponent.prototype.receivedResponse = function (response) {
        if (response === "OK") {
            this.state = 5;
        }
        else {
            this.state = 4;
        }
    };
    Odyc3AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'odyc3-app',
            directives: [logo_component_1.LogoComponent],
            templateUrl: 'odyc3.component.html',
            styleUrls: ['odyc3.component.css'],
            providers: [game_service_1.GameService]
        }), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], Odyc3AppComponent);
    return Odyc3AppComponent;
}());
exports.Odyc3AppComponent = Odyc3AppComponent;
//# sourceMappingURL=odyc3.component.js.map