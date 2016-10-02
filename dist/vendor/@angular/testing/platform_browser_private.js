"use strict";
var platform_browser_1 = require('@angular/platform-browser');
function getDOM() {
    return platform_browser_1.__platform_browser_private__.getDOM();
}
exports.getDOM = getDOM;
function setDOM(adapter) {
    platform_browser_1.__platform_browser_private__.setDOM(adapter);
}
exports.setDOM = setDOM;
exports.BrowserDomAdapter = platform_browser_1.__platform_browser_private__.BrowserDomAdapter;
exports.AnimationBuilder = platform_browser_1.__platform_browser_private__.AnimationBuilder;
exports.CssAnimationBuilder = platform_browser_1.__platform_browser_private__.CssAnimationBuilder;
exports.CssAnimationOptions = platform_browser_1.__platform_browser_private__.CssAnimationOptions;
exports.Animation = platform_browser_1.__platform_browser_private__.Animation;
exports.BrowserDetails = platform_browser_1.__platform_browser_private__.BrowserDetails;
//# sourceMappingURL=platform_browser_private.js.map