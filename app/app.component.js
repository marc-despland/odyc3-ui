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
var ng2_dragula_1 = require('ng2-dragula/ng2-dragula');
var game_service_1 = require('./game.service');
var game_1 = require('./game');
var AppComponent = (function () {
    function AppComponent(gameService) {
        this.gameService = gameService;
        this.email = '';
        this.log = '';
        this.state = 1;
        this.logosid = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    AppComponent.prototype.sendGame = function () {
        var _this = this;
        this.state = 2;
        this.log = this.email + "<br>";
        for (var i = 0; this.logosid.length > i; i++) {
            this.log += " " + this.logosid[i];
        }
        var game = new game_1.Game();
        game.email = this.email;
        game.play = this.logosid;
        console.log('Component will send the request');
        this.gameService.create(game).then(function (response) { return _this.receivedResponse(response); });
    };
    AppComponent.prototype.receivedResponse = function (response) {
        this.state = 3;
    };
    AppComponent.prototype.backInBlack = function () {
        this.state = 1;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            providers: [ng2_dragula_1.DragulaService]
        }), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map