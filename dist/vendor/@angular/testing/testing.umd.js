var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser'), require('@angular/compiler'), require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable'), require('@angular/common')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser', '@angular/compiler', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable', '@angular/common'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.testing = global.ng.testing || {}), global.ng.core, global.ng.platformBrowser, global.ng.compiler, global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx, global.ng.common));
}(this, function (exports, _angular_core, _angular_platformBrowser, _angular_compiler, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable, _angular_common) {
    'use strict';
    var globalScope;
    if (typeof window === 'undefined') {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
            // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
            globalScope = self;
        }
        else {
            globalScope = global;
        }
    }
    else {
        globalScope = window;
    }
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var global$1 = globalScope;
    // TODO: remove calls to assert in production environment
    // Note: Can't just export this and import in in other files
    // as `assert` is a reserved keyword in Dart
    global$1.assert = function assert(condition) {
        // TODO: to be fixed properly via #2830, noop for now
    };
    function isPresent(obj) {
        return obj !== undefined && obj !== null;
    }
    function isBlank(obj) {
        return obj === undefined || obj === null;
    }
    function isString(obj) {
        return typeof obj === "string";
    }
    function isArray(obj) {
        return Array.isArray(obj);
    }
    function noop() { }
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token === undefined || token === null) {
            return '' + token;
        }
        if (token.name) {
            return token.name;
        }
        if (token.overriddenName) {
            return token.overriddenName;
        }
        var res = token.toString();
        var newLineIndex = res.indexOf("\n");
        return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
    }
    var RegExpWrapper = (function () {
        function RegExpWrapper() {
        }
        RegExpWrapper.create = function (regExpStr, flags) {
            if (flags === void 0) { flags = ''; }
            flags = flags.replace(/g/g, '');
            return new global$1.RegExp(regExpStr, flags + 'g');
        };
        RegExpWrapper.firstMatch = function (regExp, input) {
            // Reset multimatch regex state
            regExp.lastIndex = 0;
            return regExp.exec(input);
        };
        RegExpWrapper.test = function (regExp, input) {
            regExp.lastIndex = 0;
            return regExp.test(input);
        };
        RegExpWrapper.matcher = function (regExp, input) {
            // Reset regex state for the case
            // someone did not loop over all matches
            // last time.
            regExp.lastIndex = 0;
            return { re: regExp, input: input };
        };
        RegExpWrapper.replaceAll = function (regExp, input, replace) {
            var c = regExp.exec(input);
            var res = '';
            regExp.lastIndex = 0;
            var prev = 0;
            while (c) {
                res += input.substring(prev, c.index);
                res += replace(c);
                prev = c.index + c[0].length;
                regExp.lastIndex = prev;
                c = regExp.exec(input);
            }
            res += input.substring(prev);
            return res;
        };
        return RegExpWrapper;
    }());
    var FunctionWrapper = (function () {
        function FunctionWrapper() {
        }
        FunctionWrapper.apply = function (fn, posArgs) { return fn.apply(null, posArgs); };
        return FunctionWrapper;
    }());
    function normalizeBlank(obj) {
        return isBlank(obj) ? null : obj;
    }
    var Map$1 = global$1.Map;
    var Set = global$1.Set;
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Map constructor.  We work around that by manually adding the items.
    var createMapFromPairs = (function () {
        try {
            if (new Map$1([[1, 2]]).size === 1) {
                return function createMapFromPairs(pairs) { return new Map$1(pairs); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromPairs(pairs) {
            var map = new Map$1();
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                map.set(pair[0], pair[1]);
            }
            return map;
        };
    })();
    var createMapFromMap = (function () {
        try {
            if (new Map$1(new Map$1())) {
                return function createMapFromMap(m) { return new Map$1(m); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromMap(m) {
            var map = new Map$1();
            m.forEach(function (v, k) { map.set(k, v); });
            return map;
        };
    })();
    var _clearValues = (function () {
        if ((new Map$1()).keys().next) {
            return function _clearValues(m) {
                var keyIterator = m.keys();
                var k;
                while (!((k = keyIterator.next()).done)) {
                    m.set(k.value, null);
                }
            };
        }
        else {
            return function _clearValuesWithForeEach(m) {
                m.forEach(function (v, k) { m.set(k, null); });
            };
        }
    })();
    // Safari doesn't implement MapIterator.next(), which is used is Traceur's polyfill of Array.from
    // TODO(mlaval): remove the work around once we have a working polyfill of Array.from
    var _arrayFromMap = (function () {
        try {
            if ((new Map$1()).values().next) {
                return function createArrayFromMap(m, getValues) {
                    return getValues ? Array.from(m.values()) : Array.from(m.keys());
                };
            }
        }
        catch (e) {
        }
        return function createArrayFromMapWithForeach(m, getValues) {
            var res = ListWrapper.createFixedSize(m.size), i = 0;
            m.forEach(function (v, k) {
                res[i] = getValues ? v : k;
                i++;
            });
            return res;
        };
    })();
    var MapWrapper = (function () {
        function MapWrapper() {
        }
        MapWrapper.clone = function (m) { return createMapFromMap(m); };
        MapWrapper.createFromStringMap = function (stringMap) {
            var result = new Map$1();
            for (var prop in stringMap) {
                result.set(prop, stringMap[prop]);
            }
            return result;
        };
        MapWrapper.toStringMap = function (m) {
            var r = {};
            m.forEach(function (v, k) { return r[k] = v; });
            return r;
        };
        MapWrapper.createFromPairs = function (pairs) { return createMapFromPairs(pairs); };
        MapWrapper.clearValues = function (m) { _clearValues(m); };
        MapWrapper.iterable = function (m) { return m; };
        MapWrapper.keys = function (m) { return _arrayFromMap(m, false); };
        MapWrapper.values = function (m) { return _arrayFromMap(m, true); };
        return MapWrapper;
    }());
    /**
     * Wraps Javascript Objects
     */
    var StringMapWrapper = (function () {
        function StringMapWrapper() {
        }
        StringMapWrapper.create = function () {
            // Note: We are not using Object.create(null) here due to
            // performance!
            // http://jsperf.com/ng2-object-create-null
            return {};
        };
        StringMapWrapper.contains = function (map, key) {
            return map.hasOwnProperty(key);
        };
        StringMapWrapper.get = function (map, key) {
            return map.hasOwnProperty(key) ? map[key] : undefined;
        };
        StringMapWrapper.set = function (map, key, value) { map[key] = value; };
        StringMapWrapper.keys = function (map) { return Object.keys(map); };
        StringMapWrapper.values = function (map) {
            return Object.keys(map).reduce(function (r, a) {
                r.push(map[a]);
                return r;
            }, []);
        };
        StringMapWrapper.isEmpty = function (map) {
            for (var prop in map) {
                return false;
            }
            return true;
        };
        StringMapWrapper.delete = function (map, key) { delete map[key]; };
        StringMapWrapper.forEach = function (map, callback) {
            for (var prop in map) {
                if (map.hasOwnProperty(prop)) {
                    callback(map[prop], prop);
                }
            }
        };
        StringMapWrapper.merge = function (m1, m2) {
            var m = {};
            for (var attr in m1) {
                if (m1.hasOwnProperty(attr)) {
                    m[attr] = m1[attr];
                }
            }
            for (var attr in m2) {
                if (m2.hasOwnProperty(attr)) {
                    m[attr] = m2[attr];
                }
            }
            return m;
        };
        StringMapWrapper.equals = function (m1, m2) {
            var k1 = Object.keys(m1);
            var k2 = Object.keys(m2);
            if (k1.length != k2.length) {
                return false;
            }
            var key;
            for (var i = 0; i < k1.length; i++) {
                key = k1[i];
                if (m1[key] !== m2[key]) {
                    return false;
                }
            }
            return true;
        };
        return StringMapWrapper;
    }());
    var ListWrapper = (function () {
        function ListWrapper() {
        }
        // JS has no way to express a statically fixed size list, but dart does so we
        // keep both methods.
        ListWrapper.createFixedSize = function (size) { return new Array(size); };
        ListWrapper.createGrowableSize = function (size) { return new Array(size); };
        ListWrapper.clone = function (array) { return array.slice(0); };
        ListWrapper.forEachWithIndex = function (array, fn) {
            for (var i = 0; i < array.length; i++) {
                fn(array[i], i);
            }
        };
        ListWrapper.first = function (array) {
            if (!array)
                return null;
            return array[0];
        };
        ListWrapper.last = function (array) {
            if (!array || array.length == 0)
                return null;
            return array[array.length - 1];
        };
        ListWrapper.indexOf = function (array, value, startIndex) {
            if (startIndex === void 0) { startIndex = 0; }
            return array.indexOf(value, startIndex);
        };
        ListWrapper.contains = function (list, el) { return list.indexOf(el) !== -1; };
        ListWrapper.reversed = function (array) {
            var a = ListWrapper.clone(array);
            return a.reverse();
        };
        ListWrapper.concat = function (a, b) { return a.concat(b); };
        ListWrapper.insert = function (list, index, value) { list.splice(index, 0, value); };
        ListWrapper.removeAt = function (list, index) {
            var res = list[index];
            list.splice(index, 1);
            return res;
        };
        ListWrapper.removeAll = function (list, items) {
            for (var i = 0; i < items.length; ++i) {
                var index = list.indexOf(items[i]);
                list.splice(index, 1);
            }
        };
        ListWrapper.remove = function (list, el) {
            var index = list.indexOf(el);
            if (index > -1) {
                list.splice(index, 1);
                return true;
            }
            return false;
        };
        ListWrapper.clear = function (list) { list.length = 0; };
        ListWrapper.isEmpty = function (list) { return list.length == 0; };
        ListWrapper.fill = function (list, value, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = null; }
            list.fill(value, start, end === null ? list.length : end);
        };
        ListWrapper.equals = function (a, b) {
            if (a.length != b.length)
                return false;
            for (var i = 0; i < a.length; ++i) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        };
        ListWrapper.slice = function (l, from, to) {
            if (from === void 0) { from = 0; }
            if (to === void 0) { to = null; }
            return l.slice(from, to === null ? undefined : to);
        };
        ListWrapper.splice = function (l, from, length) { return l.splice(from, length); };
        ListWrapper.sort = function (l, compareFn) {
            if (isPresent(compareFn)) {
                l.sort(compareFn);
            }
            else {
                l.sort();
            }
        };
        ListWrapper.toString = function (l) { return l.toString(); };
        ListWrapper.toJSON = function (l) { return JSON.stringify(l); };
        ListWrapper.maximum = function (list, predicate) {
            if (list.length == 0) {
                return null;
            }
            var solution = null;
            var maxValue = -Infinity;
            for (var index = 0; index < list.length; index++) {
                var candidate = list[index];
                if (isBlank(candidate)) {
                    continue;
                }
                var candidateValue = predicate(candidate);
                if (candidateValue > maxValue) {
                    solution = candidate;
                    maxValue = candidateValue;
                }
            }
            return solution;
        };
        ListWrapper.flatten = function (list) {
            var target = [];
            _flattenArray(list, target);
            return target;
        };
        ListWrapper.addAll = function (list, source) {
            for (var i = 0; i < source.length; i++) {
                list.push(source[i]);
            }
        };
        return ListWrapper;
    }());
    function _flattenArray(source, target) {
        if (isPresent(source)) {
            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                if (isArray(item)) {
                    _flattenArray(item, target);
                }
                else {
                    target.push(item);
                }
            }
        }
        return target;
    }
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Set constructor.  We work around that by manually adding the items.
    var createSetFromList = (function () {
        var test = new Set([1, 2, 3]);
        if (test.size === 3) {
            return function createSetFromList(lst) { return new Set(lst); };
        }
        else {
            return function createSetAndPopulateFromList(lst) {
                var res = new Set(lst);
                if (res.size !== lst.length) {
                    for (var i = 0; i < lst.length; i++) {
                        res.add(lst[i]);
                    }
                }
                return res;
            };
        }
    })();
    var BaseException = (function (_super) {
        __extends(BaseException, _super);
        function BaseException(message) {
            if (message === void 0) { message = "--"; }
            _super.call(this, message);
            this.message = message;
            this.stack = (new Error(message)).stack;
        }
        BaseException.prototype.toString = function () { return this.message; };
        return BaseException;
    }(Error));
    var TestInjector = (function () {
        function TestInjector() {
            this._instantiated = false;
            this._injector = null;
            this._providers = [];
            this.platformProviders = [];
            this.applicationProviders = [];
        }
        TestInjector.prototype.reset = function () {
            this._injector = null;
            this._providers = [];
            this._instantiated = false;
        };
        TestInjector.prototype.addProviders = function (providers) {
            if (this._instantiated) {
                throw new BaseException('Cannot add providers after test injector is instantiated');
            }
            this._providers = ListWrapper.concat(this._providers, providers);
        };
        TestInjector.prototype.createInjector = function () {
            var rootInjector = _angular_core.ReflectiveInjector.resolveAndCreate(this.platformProviders);
            this._injector = rootInjector.resolveAndCreateChild(ListWrapper.concat(this.applicationProviders, this._providers));
            this._instantiated = true;
            return this._injector;
        };
        TestInjector.prototype.execute = function (fn) {
            var additionalProviders = fn.additionalProviders();
            if (additionalProviders.length > 0) {
                this.addProviders(additionalProviders);
            }
            if (!this._instantiated) {
                this.createInjector();
            }
            return fn.execute(this._injector);
        };
        return TestInjector;
    }());
    var _testInjector = null;
    function getTestInjector() {
        if (_testInjector == null) {
            _testInjector = new TestInjector();
        }
        return _testInjector;
    }
    /**
     * Set the providers that the test injector should use. These should be providers
     * common to every test in the suite.
     *
     * This may only be called once, to set up the common providers for the current test
     * suite on teh current platform. If you absolutely need to change the providers,
     * first use `resetBaseTestProviders`.
     *
     * Test Providers for individual platforms are available from
     * 'angular2/platform/testing/<platform_name>'.
     */
    function setBaseTestProviders(platformProviders, applicationProviders) {
        var testInjector = getTestInjector();
        if (testInjector.platformProviders.length > 0 || testInjector.applicationProviders.length > 0) {
            throw new BaseException('Cannot set base providers because it has already been called');
        }
        testInjector.platformProviders = platformProviders;
        testInjector.applicationProviders = applicationProviders;
        var injector = testInjector.createInjector();
        var inits = injector.get(_angular_core.PLATFORM_INITIALIZER, null);
        if (isPresent(inits)) {
            inits.forEach(function (init) { return init(); });
        }
        testInjector.reset();
    }
    /**
     * Reset the providers for the test injector.
     */
    function resetBaseTestProviders() {
        var testInjector = getTestInjector();
        testInjector.platformProviders = [];
        testInjector.applicationProviders = [];
        testInjector.reset();
    }
    /**
     * Allows injecting dependencies in `beforeEach()` and `it()`.
     *
     * Example:
     *
     * ```
     * beforeEach(inject([Dependency, AClass], (dep, object) => {
     *   // some code that uses `dep` and `object`
     *   // ...
     * }));
     *
     * it('...', inject([AClass], (object) => {
     *   object.doSomething();
     *   expect(...);
     * })
     * ```
     *
     * Notes:
     * - inject is currently a function because of some Traceur limitation the syntax should
     * eventually
     *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
     *
     * @param {Array} tokens
     * @param {Function} fn
     * @return {FunctionWithParamTokens}
     */
    function inject(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, false);
    }
    var InjectSetupWrapper = (function () {
        function InjectSetupWrapper(_providers) {
            this._providers = _providers;
        }
        InjectSetupWrapper.prototype.inject = function (tokens, fn) {
            return new FunctionWithParamTokens(tokens, fn, false, this._providers);
        };
        /** @Deprecated {use async(withProviders().inject())} */
        InjectSetupWrapper.prototype.injectAsync = function (tokens, fn) {
            return new FunctionWithParamTokens(tokens, fn, true, this._providers);
        };
        return InjectSetupWrapper;
    }());
    function withProviders(providers) {
        return new InjectSetupWrapper(providers);
    }
    /**
     * @Deprecated {use async(inject())}
     *
     * Allows injecting dependencies in `beforeEach()` and `it()`. The test must return
     * a promise which will resolve when all asynchronous activity is complete.
     *
     * Example:
     *
     * ```
     * it('...', injectAsync([AClass], (object) => {
     *   return object.doSomething().then(() => {
     *     expect(...);
     *   });
     * })
     * ```
     *
     * @param {Array} tokens
     * @param {Function} fn
     * @return {FunctionWithParamTokens}
     */
    function injectAsync(tokens, fn) {
        return new FunctionWithParamTokens(tokens, fn, true);
    }
    /**
     * Wraps a test function in an asynchronous test zone. The test will automatically
     * complete when all asynchronous calls within this zone are done. Can be used
     * to wrap an {@link inject} call.
     *
     * Example:
     *
     * ```
     * it('...', async(inject([AClass], (object) => {
     *   object.doSomething.then(() => {
     *     expect(...);
     *   })
     * });
     * ```
     */
    function async(fn) {
        if (fn instanceof FunctionWithParamTokens) {
            fn.isAsync = true;
            return fn;
        }
        else if (fn instanceof Function) {
            return new FunctionWithParamTokens([], fn, true);
        }
        else {
            throw new BaseException('argument to async must be a function or inject(<Function>)');
        }
    }
    function emptyArray() {
        return [];
    }
    var FunctionWithParamTokens = (function () {
        function FunctionWithParamTokens(_tokens, fn, isAsync, additionalProviders) {
            if (additionalProviders === void 0) { additionalProviders = emptyArray; }
            this._tokens = _tokens;
            this.fn = fn;
            this.isAsync = isAsync;
            this.additionalProviders = additionalProviders;
        }
        /**
         * Returns the value of the executed function.
         */
        FunctionWithParamTokens.prototype.execute = function (injector) {
            var params = this._tokens.map(function (t) { return injector.get(t); });
            return FunctionWrapper.apply(this.fn, params);
        };
        FunctionWithParamTokens.prototype.hasToken = function (token) { return this._tokens.indexOf(token) > -1; };
        return FunctionWithParamTokens;
    }());
    function getDOM() {
        return _angular_platformBrowser.__platform_browser_private__.getDOM();
    }
    var _global$1 = (typeof window === 'undefined' ? global$1 : window);
    /**
     * Jasmine matching function with Angular matchers mixed in.
     *
     * ## Example
     *
     * {@example testing/ts/matchers.ts region='toHaveText'}
     */
    var expect = _global$1.expect;
    // Some Map polyfills don't polyfill Map.toString correctly, which
    // gives us bad error messages in tests.
    // The only way to do this in Jasmine is to monkey patch a method
    // to the object :-(
    Map.prototype['jasmineToString'] = function () {
        var m = this;
        if (!m) {
            return '' + m;
        }
        var res = [];
        m.forEach(function (v, k) { res.push(k + ":" + v); });
        return "{ " + res.join(',') + " }";
    };
    _global$1.beforeEach(function () {
        jasmine.addMatchers({
            // Custom handler for Map as Jasmine does not support it yet
            toEqual: function (util, customEqualityTesters) {
                return {
                    compare: function (actual, expected) {
                        return { pass: util.equals(actual, expected, [compareMap]) };
                    }
                };
                function compareMap(actual, expected) {
                    if (actual instanceof Map) {
                        var pass = actual.size === expected.size;
                        if (pass) {
                            actual.forEach(function (v, k) { pass = pass && util.equals(v, expected.get(k)); });
                        }
                        return pass;
                    }
                    else {
                        return undefined;
                    }
                }
            },
            toBePromise: function () {
                return {
                    compare: function (actual, expectedClass) {
                        var pass = typeof actual === 'object' && typeof actual.then === 'function';
                        return { pass: pass, get message() { return 'Expected ' + actual + ' to be a promise'; } };
                    }
                };
            },
            toBeAnInstanceOf: function () {
                return {
                    compare: function (actual, expectedClass) {
                        var pass = typeof actual === 'object' && actual instanceof expectedClass;
                        return {
                            pass: pass,
                            get message() {
                                return 'Expected ' + actual + ' to be an instance of ' + expectedClass;
                            }
                        };
                    }
                };
            },
            toHaveText: function () {
                return {
                    compare: function (actual, expectedText) {
                        var actualText = elementText(actual);
                        return {
                            pass: actualText == expectedText,
                            get message() { return 'Expected ' + actualText + ' to be equal to ' + expectedText; }
                        };
                    }
                };
            },
            toHaveCssClass: function () {
                return { compare: buildError(false), negativeCompare: buildError(true) };
                function buildError(isNot) {
                    return function (actual, className) {
                        return {
                            pass: getDOM().hasClass(actual, className) == !isNot,
                            get message() {
                                return "Expected " + actual.outerHTML + " " + (isNot ? 'not ' : '') + "to contain the CSS class \"" + className + "\"";
                            }
                        };
                    };
                }
            },
            toHaveCssStyle: function () {
                return {
                    compare: function (actual, styles) {
                        var allPassed;
                        if (isString(styles)) {
                            allPassed = getDOM().hasStyle(actual, styles);
                        }
                        else {
                            allPassed = !StringMapWrapper.isEmpty(styles);
                            StringMapWrapper.forEach(styles, function (style, prop) {
                                allPassed = allPassed && getDOM().hasStyle(actual, prop, style);
                            });
                        }
                        return {
                            pass: allPassed,
                            get message() {
                                var expectedValueStr = isString(styles) ? styles : JSON.stringify(styles);
                                return "Expected " + actual.outerHTML + " " + (!allPassed ? ' ' : 'not ') + "to contain the\n                      CSS " + (isString(styles) ? 'property' : 'styles') + " \"" + expectedValueStr + "\"";
                            }
                        };
                    }
                };
            },
            toContainError: function () {
                return {
                    compare: function (actual, expectedText) {
                        var errorMessage = actual.toString();
                        return {
                            pass: errorMessage.indexOf(expectedText) > -1,
                            get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                        };
                    }
                };
            },
            toThrowErrorWith: function () {
                return {
                    compare: function (actual, expectedText) {
                        try {
                            actual();
                            return {
                                pass: false,
                                get message() { return "Was expected to throw, but did not throw"; }
                            };
                        }
                        catch (e) {
                            var errorMessage = e.toString();
                            return {
                                pass: errorMessage.indexOf(expectedText) > -1,
                                get message() { return 'Expected ' + errorMessage + ' to contain ' + expectedText; }
                            };
                        }
                    }
                };
            },
            toMatchPattern: function () {
                return { compare: buildError(false), negativeCompare: buildError(true) };
                function buildError(isNot) {
                    return function (actual, regex) {
                        return {
                            pass: regex.test(actual) == !isNot,
                            get message() {
                                return "Expected " + actual + " " + (isNot ? 'not ' : '') + "to match " + regex.toString();
                            }
                        };
                    };
                }
            },
            toImplement: function () {
                return {
                    compare: function (actualObject, expectedInterface) {
                        var objProps = Object.keys(actualObject.constructor.prototype);
                        var intProps = Object.keys(expectedInterface.prototype);
                        var missedMethods = [];
                        intProps.forEach(function (k) {
                            if (!actualObject.constructor.prototype[k])
                                missedMethods.push(k);
                        });
                        return {
                            pass: missedMethods.length == 0,
                            get message() {
                                return 'Expected ' + actualObject + ' to have the following methods: ' +
                                    missedMethods.join(", ");
                            }
                        };
                    }
                };
            }
        });
    });
    function elementText(n) {
        var hasNodes = function (n) {
            var children = getDOM().childNodes(n);
            return children && children.length > 0;
        };
        if (n instanceof Array) {
            return n.map(elementText).join("");
        }
        if (getDOM().isCommentNode(n)) {
            return '';
        }
        if (getDOM().isElementNode(n) && getDOM().tagName(n) == 'CONTENT') {
            return elementText(Array.prototype.slice.apply(getDOM().getDistributedNodes(n)));
        }
        if (getDOM().hasShadowRoot(n)) {
            return elementText(getDOM().childNodesAsList(getDOM().getShadowRoot(n)));
        }
        if (hasNodes(n)) {
            return elementText(getDOM().childNodesAsList(n));
        }
        return getDOM().getText(n);
    }
    var _global = (typeof window === 'undefined' ? global$1 : window);
    /**
     * Run a function (with an optional asynchronous callback) after each test case.
     *
     * See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='afterEach'}
     */
    var afterEach = _global.afterEach;
    /**
     * Group test cases together under a common description prefix.
     *
     * See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='describeIt'}
     */
    var describe = _global.describe;
    /**
     * See {@link fdescribe}.
     */
    var ddescribe = _global.fdescribe;
    /**
     * Like {@link describe}, but instructs the test runner to only run
     * the test cases in this group. This is useful for debugging.
     *
     * See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='fdescribe'}
     */
    var fdescribe = _global.fdescribe;
    /**
     * Like {@link describe}, but instructs the test runner to exclude
     * this group of test cases from execution. This is useful for
     * debugging, or for excluding broken tests until they can be fixed.
     *
     * See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='xdescribe'}
     */
    var xdescribe = _global.xdescribe;
    var jsmBeforeEach = _global.beforeEach;
    var jsmIt = _global.it;
    var jsmIIt = _global.fit;
    var jsmXIt = _global.xit;
    var testInjector = getTestInjector();
    // Reset the test providers before each test.
    jsmBeforeEach(function () { testInjector.reset(); });
    /**
     * Allows overriding default providers of the test injector,
     * which are defined in test_injector.js.
     *
     * The given function must return a list of DI providers.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='beforeEachProviders'}
     */
    function beforeEachProviders(fn) {
        jsmBeforeEach(function () {
            var providers = fn();
            if (!providers)
                return;
            try {
                testInjector.addProviders(providers);
            }
            catch (e) {
                throw new Error('beforeEachProviders was called after the injector had ' +
                    'been used in a beforeEach or it block. This invalidates the ' +
                    'test injector');
            }
        });
    }
    function runInAsyncTestZone(fnToExecute, finishCallback, failCallback, testName) {
        if (testName === void 0) { testName = ''; }
        var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
        var testZoneSpec = new AsyncTestZoneSpec(finishCallback, failCallback, testName);
        var testZone = Zone.current.fork(testZoneSpec);
        return testZone.run(fnToExecute);
    }
    function _it(jsmFn, name, testFn, testTimeOut) {
        var timeOut = testTimeOut;
        if (testFn instanceof FunctionWithParamTokens) {
            var testFnT_1 = testFn;
            jsmFn(name, function (done) {
                if (testFnT_1.isAsync) {
                    runInAsyncTestZone(function () { return testInjector.execute(testFnT_1); }, done, done.fail, name);
                }
                else {
                    testInjector.execute(testFnT_1);
                    done();
                }
            }, timeOut);
        }
        else {
            // The test case doesn't use inject(). ie `it('test', (done) => { ... }));`
            jsmFn(name, testFn, timeOut);
        }
    }
    /**
     * Wrapper around Jasmine beforeEach function.
     *
     * beforeEach may be used with the `inject` function to fetch dependencies.
     *
     * See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='beforeEach'}
     */
    function beforeEach(fn) {
        if (fn instanceof FunctionWithParamTokens) {
            // The test case uses inject(). ie `beforeEach(inject([ClassA], (a) => { ...
            // }));`
            var fnT_1 = fn;
            jsmBeforeEach(function (done) {
                if (fnT_1.isAsync) {
                    runInAsyncTestZone(function () { return testInjector.execute(fnT_1); }, done, done.fail, 'beforeEach');
                }
                else {
                    testInjector.execute(fnT_1);
                    done();
                }
            });
        }
        else {
            // The test case doesn't use inject(). ie `beforeEach((done) => { ... }));`
            if (fn.length === 0) {
                jsmBeforeEach(function () { fn(); });
            }
            else {
                jsmBeforeEach(function (done) { fn(done); });
            }
        }
    }
    /**
     * Define a single test case with the given test name and execution function.
     *
     * The test function can be either a synchronous function, the result of {@link async},
     * or an injected function created via {@link inject}.
     *
     * Wrapper around Jasmine it function. See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='describeIt'}
     */
    function it(name, fn, timeOut) {
        if (timeOut === void 0) { timeOut = null; }
        return _it(jsmIt, name, fn, timeOut);
    }
    /**
     * Like {@link it}, but instructs the test runner to exclude this test
     * entirely. Useful for debugging or for excluding broken tests until
     * they can be fixed.
     *
     * Wrapper around Jasmine xit function. See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='xit'}
     */
    function xit(name, fn, timeOut) {
        if (timeOut === void 0) { timeOut = null; }
        return _it(jsmXIt, name, fn, timeOut);
    }
    /**
     * See {@link fit}.
     */
    function iit(name, fn, timeOut) {
        if (timeOut === void 0) { timeOut = null; }
        return _it(jsmIIt, name, fn, timeOut);
    }
    /**
     * Like {@link it}, but instructs the test runner to only run this test.
     * Useful for debugging.
     *
     * Wrapper around Jasmine fit function. See http://jasmine.github.io/ for more details.
     *
     * ## Example:
     *
     * {@example testing/ts/testing.ts region='fit'}
     */
    function fit(name, fn, timeOut) {
        if (timeOut === void 0) { timeOut = null; }
        return _it(jsmIIt, name, fn, timeOut);
    }
    var PromiseCompleter = (function () {
        function PromiseCompleter() {
            var _this = this;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        return PromiseCompleter;
    }());
    var PromiseWrapper = (function () {
        function PromiseWrapper() {
        }
        PromiseWrapper.resolve = function (obj) { return Promise.resolve(obj); };
        PromiseWrapper.reject = function (obj, _) { return Promise.reject(obj); };
        // Note: We can't rename this method into `catch`, as this is not a valid
        // method name in Dart.
        PromiseWrapper.catchError = function (promise, onError) {
            return promise.catch(onError);
        };
        PromiseWrapper.all = function (promises) {
            if (promises.length == 0)
                return Promise.resolve([]);
            return Promise.all(promises);
        };
        PromiseWrapper.then = function (promise, success, rejection) {
            return promise.then(success, rejection);
        };
        PromiseWrapper.wrap = function (computation) {
            return new Promise(function (res, rej) {
                try {
                    res(computation());
                }
                catch (e) {
                    rej(e);
                }
            });
        };
        PromiseWrapper.scheduleMicrotask = function (computation) {
            PromiseWrapper.then(PromiseWrapper.resolve(null), computation, function (_) { });
        };
        PromiseWrapper.isPromise = function (obj) { return obj instanceof Promise; };
        PromiseWrapper.completer = function () { return new PromiseCompleter(); };
        return PromiseWrapper;
    }());
    var ObservableWrapper = (function () {
        function ObservableWrapper() {
        }
        // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
        ObservableWrapper.subscribe = function (emitter, onNext, onError, onComplete) {
            if (onComplete === void 0) { onComplete = function () { }; }
            onError = (typeof onError === "function") && onError || noop;
            onComplete = (typeof onComplete === "function") && onComplete || noop;
            return emitter.subscribe({ next: onNext, error: onError, complete: onComplete });
        };
        ObservableWrapper.isObservable = function (obs) { return !!obs.subscribe; };
        /**
         * Returns whether `obs` has any subscribers listening to events.
         */
        ObservableWrapper.hasSubscribers = function (obs) { return obs.observers.length > 0; };
        ObservableWrapper.dispose = function (subscription) { subscription.unsubscribe(); };
        /**
         * @deprecated - use callEmit() instead
         */
        ObservableWrapper.callNext = function (emitter, value) { emitter.next(value); };
        ObservableWrapper.callEmit = function (emitter, value) { emitter.emit(value); };
        ObservableWrapper.callError = function (emitter, error) { emitter.error(error); };
        ObservableWrapper.callComplete = function (emitter) { emitter.complete(); };
        ObservableWrapper.fromPromise = function (promise) {
            return rxjs_observable_PromiseObservable.PromiseObservable.create(promise);
        };
        ObservableWrapper.toPromise = function (obj) { return rxjs_operator_toPromise.toPromise.call(obj); };
        return ObservableWrapper;
    }());
    /**
     * Use by directives and components to emit custom Events.
     *
     * ### Examples
     *
     * In the following example, `Zippy` alternatively emits `open` and `close` events when its
     * title gets clicked:
     *
     * ```
     * @Component({
     *   selector: 'zippy',
     *   template: `
     *   <div class="zippy">
     *     <div (click)="toggle()">Toggle</div>
     *     <div [hidden]="!visible">
     *       <ng-content></ng-content>
     *     </div>
     *  </div>`})
     * export class Zippy {
     *   visible: boolean = true;
     *   @Output() open: EventEmitter<any> = new EventEmitter();
     *   @Output() close: EventEmitter<any> = new EventEmitter();
     *
     *   toggle() {
     *     this.visible = !this.visible;
     *     if (this.visible) {
     *       this.open.emit(null);
     *     } else {
     *       this.close.emit(null);
     *     }
     *   }
     * }
     * ```
     *
     * Use Rx.Observable but provides an adapter to make it work as specified here:
     * https://github.com/jhusain/observable-spec
     *
     * Once a reference implementation of the spec is available, switch to it.
     */
    var EventEmitter = (function (_super) {
        __extends(EventEmitter, _super);
        /**
         * Creates an instance of [EventEmitter], which depending on [isAsync],
         * delivers events synchronously or asynchronously.
         */
        function EventEmitter(isAsync) {
            if (isAsync === void 0) { isAsync = true; }
            _super.call(this);
            this._isAsync = isAsync;
        }
        EventEmitter.prototype.emit = function (value) { _super.prototype.next.call(this, value); };
        /**
         * @deprecated - use .emit(value) instead
         */
        EventEmitter.prototype.next = function (value) { _super.prototype.next.call(this, value); };
        EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
            var schedulerFn;
            var errorFn = function (err) { return null; };
            var completeFn = function () { return null; };
            if (generatorOrNext && typeof generatorOrNext === 'object') {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext.next(value); }); } :
                    function (value) { generatorOrNext.next(value); };
                if (generatorOrNext.error) {
                    errorFn = this._isAsync ? function (err) { setTimeout(function () { return generatorOrNext.error(err); }); } :
                        function (err) { generatorOrNext.error(err); };
                }
                if (generatorOrNext.complete) {
                    completeFn = this._isAsync ? function () { setTimeout(function () { return generatorOrNext.complete(); }); } :
                        function () { generatorOrNext.complete(); };
                }
            }
            else {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext(value); }); } :
                    function (value) { generatorOrNext(value); };
                if (error) {
                    errorFn =
                        this._isAsync ? function (err) { setTimeout(function () { return error(err); }); } : function (err) { error(err); };
                }
                if (complete) {
                    completeFn =
                        this._isAsync ? function () { setTimeout(function () { return complete(); }); } : function () { complete(); };
                }
            }
            return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
        };
        return EventEmitter;
    }(rxjs_Subject.Subject));
    var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$1 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    var Log = (function () {
        function Log() {
            this.logItems = [];
        }
        Log.prototype.add = function (value) { this.logItems.push(value); };
        Log.prototype.fn = function (value) {
            var _this = this;
            return function (a1, a2, a3, a4, a5) {
                if (a1 === void 0) { a1 = null; }
                if (a2 === void 0) { a2 = null; }
                if (a3 === void 0) { a3 = null; }
                if (a4 === void 0) { a4 = null; }
                if (a5 === void 0) { a5 = null; }
                _this.logItems.push(value);
            };
        };
        Log.prototype.clear = function () { this.logItems = []; };
        Log.prototype.result = function () { return this.logItems.join("; "); };
        return Log;
    }());
    Log = __decorate$1([
        _angular_core.Injectable(),
        __metadata$1('design:paramtypes', [])
    ], Log);
    function el(html) {
        return getDOM().firstChild(getDOM().content(getDOM().createTemplate(html)));
    }
    var _RE_SPECIAL_CHARS = ['-', '[', ']', '/', '{', '}', '\\', '(', ')', '*', '+', '?', '.', '^', '$', '|'];
    var _ESCAPE_RE = RegExpWrapper.create("[\\" + _RE_SPECIAL_CHARS.join('\\') + "]");
    var _FakeAsyncTestZoneSpecType = Zone['FakeAsyncTestZoneSpec'];
    /**
     * Wraps a function to be executed in the fakeAsync zone:
     * - microtasks are manually executed by calling `flushMicrotasks()`,
     * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
     *
     * If there are any pending timers at the end of the function, an exception will be thrown.
     *
     * Can be used to wrap inject() calls.
     *
     * ## Example
     *
     * {@example testing/ts/fake_async.ts region='basic'}
     *
     * @param fn
     * @returns {Function} The function wrapped to be executed in the fakeAsync zone
     */
    function fakeAsync(fn) {
        if (Zone.current.get('FakeAsyncTestZoneSpec') != null) {
            throw new BaseException('fakeAsync() calls can not be nested');
        }
        var fakeAsyncTestZoneSpec = new _FakeAsyncTestZoneSpecType();
        var fakeAsyncZone = Zone.current.fork(fakeAsyncTestZoneSpec);
        var innerTestFn = null;
        if (fn instanceof FunctionWithParamTokens) {
            if (fn.isAsync) {
                throw new BaseException('Cannot wrap async test with fakeAsync');
            }
            innerTestFn = function () { getTestInjector().execute(fn); };
        }
        else {
            innerTestFn = fn;
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var res = fakeAsyncZone.run(function () {
                var res = innerTestFn.apply(void 0, args);
                flushMicrotasks();
                return res;
            });
            if (fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
                throw new BaseException((fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " ") +
                    "periodic timer(s) still in the queue.");
            }
            if (fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
                throw new BaseException(fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
            }
            return res;
        };
    }
    function _getFakeAsyncZoneSpec() {
        var zoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
        if (zoneSpec == null) {
            throw new Error('The code should be running in the fakeAsync zone to call this function');
        }
        return zoneSpec;
    }
    /**
     * Clear the queue of pending timers and microtasks.
     * Tests no longer need to call this explicitly.
     *
     * @deprecated
     */
    function clearPendingTimers() {
        // Do nothing.
    }
    /**
     * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
     *
     * The microtasks queue is drained at the very start of this function and after any timer callback
     * has been executed.
     *
     * ## Example
     *
     * {@example testing/ts/fake_async.ts region='basic'}
     *
     * @param {number} millis Number of millisecond, defaults to 0
     */
    function tick(millis) {
        if (millis === void 0) { millis = 0; }
        _getFakeAsyncZoneSpec().tick(millis);
    }
    /**
     * Flush any pending microtasks.
     */
    function flushMicrotasks() {
        _getFakeAsyncZoneSpec().flushMicrotasks();
    }
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * Fixture for debugging and testing a component.
     */
    var ComponentFixture = (function () {
        function ComponentFixture(componentRef) {
            this.changeDetectorRef = componentRef.changeDetectorRef;
            this.elementRef = componentRef.location;
            this.debugElement = _angular_core.getDebugNode(this.elementRef.nativeElement);
            this.componentInstance = componentRef.instance;
            this.nativeElement = this.elementRef.nativeElement;
            this.componentRef = componentRef;
        }
        /**
         * Trigger a change detection cycle for the component.
         */
        ComponentFixture.prototype.detectChanges = function (checkNoChanges) {
            if (checkNoChanges === void 0) { checkNoChanges = true; }
            this.changeDetectorRef.detectChanges();
            if (checkNoChanges) {
                this.checkNoChanges();
            }
        };
        ComponentFixture.prototype.checkNoChanges = function () { this.changeDetectorRef.checkNoChanges(); };
        /**
         * Trigger component destruction.
         */
        ComponentFixture.prototype.destroy = function () { this.componentRef.destroy(); };
        return ComponentFixture;
    }());
    var _nextRootElementId = 0;
    /**
     * Builds a ComponentFixture for use in component level tests.
     */
    var TestComponentBuilder_1;
    exports.TestComponentBuilder = TestComponentBuilder_1 = (function () {
        function TestComponentBuilder(_injector) {
            this._injector = _injector;
            /** @internal */
            this._bindingsOverrides = new Map();
            /** @internal */
            this._directiveOverrides = new Map();
            /** @internal */
            this._templateOverrides = new Map();
            /** @internal */
            this._viewBindingsOverrides = new Map();
            /** @internal */
            this._viewOverrides = new Map();
        }
        /** @internal */
        TestComponentBuilder.prototype._clone = function () {
            var clone = new TestComponentBuilder_1(this._injector);
            clone._viewOverrides = MapWrapper.clone(this._viewOverrides);
            clone._directiveOverrides = MapWrapper.clone(this._directiveOverrides);
            clone._templateOverrides = MapWrapper.clone(this._templateOverrides);
            clone._bindingsOverrides = MapWrapper.clone(this._bindingsOverrides);
            clone._viewBindingsOverrides = MapWrapper.clone(this._viewBindingsOverrides);
            return clone;
        };
        /**
         * Overrides only the html of a {@link ComponentMetadata}.
         * All the other properties of the component's {@link ViewMetadata} are preserved.
         *
         * @param {Type} component
         * @param {string} html
         *
         * @return {TestComponentBuilder}
         */
        TestComponentBuilder.prototype.overrideTemplate = function (componentType, template) {
            var clone = this._clone();
            clone._templateOverrides.set(componentType, template);
            return clone;
        };
        /**
         * Overrides a component's {@link ViewMetadata}.
         *
         * @param {Type} component
         * @param {view} View
         *
         * @return {TestComponentBuilder}
         */
        TestComponentBuilder.prototype.overrideView = function (componentType, view) {
            var clone = this._clone();
            clone._viewOverrides.set(componentType, view);
            return clone;
        };
        /**
         * Overrides the directives from the component {@link ViewMetadata}.
         *
         * @param {Type} component
         * @param {Type} from
         * @param {Type} to
         *
         * @return {TestComponentBuilder}
         */
        TestComponentBuilder.prototype.overrideDirective = function (componentType, from, to) {
            var clone = this._clone();
            var overridesForComponent = clone._directiveOverrides.get(componentType);
            if (!isPresent(overridesForComponent)) {
                clone._directiveOverrides.set(componentType, new Map());
                overridesForComponent = clone._directiveOverrides.get(componentType);
            }
            overridesForComponent.set(from, to);
            return clone;
        };
        /**
         * Overrides one or more injectables configured via `providers` metadata property of a directive
         * or
         * component.
         * Very useful when certain providers need to be mocked out.
         *
         * The providers specified via this method are appended to the existing `providers` causing the
         * duplicated providers to
         * be overridden.
         *
         * @param {Type} component
         * @param {any[]} providers
         *
         * @return {TestComponentBuilder}
         */
        TestComponentBuilder.prototype.overrideProviders = function (type, providers) {
            var clone = this._clone();
            clone._bindingsOverrides.set(type, providers);
            return clone;
        };
        /**
         * @deprecated
         */
        TestComponentBuilder.prototype.overrideBindings = function (type, providers) {
            return this.overrideProviders(type, providers);
        };
        /**
         * Overrides one or more injectables configured via `providers` metadata property of a directive
         * or
         * component.
         * Very useful when certain providers need to be mocked out.
         *
         * The providers specified via this method are appended to the existing `providers` causing the
         * duplicated providers to
         * be overridden.
         *
         * @param {Type} component
         * @param {any[]} providers
         *
         * @return {TestComponentBuilder}
         */
        TestComponentBuilder.prototype.overrideViewProviders = function (type, providers) {
            var clone = this._clone();
            clone._viewBindingsOverrides.set(type, providers);
            return clone;
        };
        /**
         * @deprecated
         */
        TestComponentBuilder.prototype.overrideViewBindings = function (type, providers) {
            return this.overrideViewProviders(type, providers);
        };
        /**
         * Builds and returns a ComponentFixture.
         *
         * @return {Promise<ComponentFixture>}
         */
        TestComponentBuilder.prototype.createAsync = function (rootComponentType) {
            var mockDirectiveResolver = this._injector.get(_angular_compiler.DirectiveResolver);
            var mockViewResolver = this._injector.get(_angular_compiler.ViewResolver);
            this._viewOverrides.forEach(function (view, type) { return mockViewResolver.setView(type, view); });
            this._templateOverrides.forEach(function (template, type) { return mockViewResolver.setInlineTemplate(type, template); });
            this._directiveOverrides.forEach(function (overrides, component) {
                overrides.forEach(function (to, from) { mockViewResolver.overrideViewDirective(component, from, to); });
            });
            this._bindingsOverrides.forEach(function (bindings, type) { return mockDirectiveResolver.setBindingsOverride(type, bindings); });
            this._viewBindingsOverrides.forEach(function (bindings, type) { return mockDirectiveResolver.setViewBindingsOverride(type, bindings); });
            var rootElId = "root" + _nextRootElementId++;
            var rootEl = el("<div id=\"" + rootElId + "\"></div>");
            var doc = this._injector.get(_angular_platformBrowser.DOCUMENT);
            // TODO(juliemr): can/should this be optional?
            var oldRoots = getDOM().querySelectorAll(doc, '[id^=root]');
            for (var i = 0; i < oldRoots.length; i++) {
                getDOM().remove(oldRoots[i]);
            }
            getDOM().appendChild(doc.body, rootEl);
            var promise = this._injector.get(_angular_core.DynamicComponentLoader)
                .loadAsRoot(rootComponentType, "#" + rootElId, this._injector);
            return promise.then(function (componentRef) { return new ComponentFixture(componentRef); });
        };
        TestComponentBuilder.prototype.createFakeAsync = function (rootComponentType) {
            var result;
            var error;
            PromiseWrapper.then(this.createAsync(rootComponentType), function (_result) { result = _result; }, function (_error) { error = _error; });
            tick();
            if (isPresent(error)) {
                throw error;
            }
            return result;
        };
        return TestComponentBuilder;
    }());
    exports.TestComponentBuilder = TestComponentBuilder_1 = __decorate([
        _angular_core.Injectable(),
        __metadata('design:paramtypes', [_angular_core.Injector])
    ], exports.TestComponentBuilder);
    var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$2 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    exports.MockViewResolver = (function (_super) {
        __extends(MockViewResolver, _super);
        function MockViewResolver() {
            _super.call(this);
            /** @internal */
            this._views = new Map$1();
            /** @internal */
            this._inlineTemplates = new Map$1();
            /** @internal */
            this._viewCache = new Map$1();
            /** @internal */
            this._directiveOverrides = new Map$1();
        }
        /**
         * Overrides the {@link ViewMetadata} for a component.
         *
         * @param {Type} component
         * @param {ViewDefinition} view
         */
        MockViewResolver.prototype.setView = function (component, view) {
            this._checkOverrideable(component);
            this._views.set(component, view);
        };
        /**
         * Overrides the inline template for a component - other configuration remains unchanged.
         *
         * @param {Type} component
         * @param {string} template
         */
        MockViewResolver.prototype.setInlineTemplate = function (component, template) {
            this._checkOverrideable(component);
            this._inlineTemplates.set(component, template);
        };
        /**
         * Overrides a directive from the component {@link ViewMetadata}.
         *
         * @param {Type} component
         * @param {Type} from
         * @param {Type} to
         */
        MockViewResolver.prototype.overrideViewDirective = function (component, from, to) {
            this._checkOverrideable(component);
            var overrides = this._directiveOverrides.get(component);
            if (isBlank(overrides)) {
                overrides = new Map$1();
                this._directiveOverrides.set(component, overrides);
            }
            overrides.set(from, to);
        };
        /**
         * Returns the {@link ViewMetadata} for a component:
         * - Set the {@link ViewMetadata} to the overridden view when it exists or fallback to the default
         * `ViewResolver`,
         *   see `setView`.
         * - Override the directives, see `overrideViewDirective`.
         * - Override the @View definition, see `setInlineTemplate`.
         *
         * @param component
         * @returns {ViewDefinition}
         */
        MockViewResolver.prototype.resolve = function (component) {
            var view = this._viewCache.get(component);
            if (isPresent(view))
                return view;
            view = this._views.get(component);
            if (isBlank(view)) {
                view = _super.prototype.resolve.call(this, component);
            }
            var directives = view.directives;
            var overrides = this._directiveOverrides.get(component);
            if (isPresent(overrides) && isPresent(directives)) {
                directives = ListWrapper.clone(view.directives);
                overrides.forEach(function (to, from) {
                    var srcIndex = directives.indexOf(from);
                    if (srcIndex == -1) {
                        throw new BaseException("Overriden directive " + stringify(from) + " not found in the template of " + stringify(component));
                    }
                    directives[srcIndex] = to;
                });
                view = new _angular_core.ViewMetadata({ template: view.template, templateUrl: view.templateUrl, directives: directives });
            }
            var inlineTemplate = this._inlineTemplates.get(component);
            if (isPresent(inlineTemplate)) {
                view = new _angular_core.ViewMetadata({ template: inlineTemplate, templateUrl: null, directives: view.directives });
            }
            this._viewCache.set(component, view);
            return view;
        };
        /**
         * @internal
         *
         * Once a component has been compiled, the AppProtoView is stored in the compiler cache.
         *
         * Then it should not be possible to override the component configuration after the component
         * has been compiled.
         *
         * @param {Type} component
         */
        MockViewResolver.prototype._checkOverrideable = function (component) {
            var cached = this._viewCache.get(component);
            if (isPresent(cached)) {
                throw new BaseException("The component " + stringify(component) + " has already been compiled, its configuration can not be changed");
            }
        };
        return MockViewResolver;
    }(_angular_compiler.ViewResolver));
    exports.MockViewResolver = __decorate$2([
        _angular_core.Injectable(),
        __metadata$2('design:paramtypes', [])
    ], exports.MockViewResolver);
    /**
     * A mock implementation of {@link XHR} that allows outgoing requests to be mocked
     * and responded to within a single test, without going to the network.
     */
    var MockXHR = (function (_super) {
        __extends(MockXHR, _super);
        function MockXHR() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.apply(this, args);
            this._expectations = [];
            this._definitions = new Map$1();
            this._requests = [];
        }
        MockXHR.prototype.get = function (url) {
            var request = new _PendingRequest(url);
            this._requests.push(request);
            return request.getPromise();
        };
        /**
         * Add an expectation for the given URL. Incoming requests will be checked against
         * the next expectation (in FIFO order). The `verifyNoOutstandingExpectations` method
         * can be used to check if any expectations have not yet been met.
         *
         * The response given will be returned if the expectation matches.
         */
        MockXHR.prototype.expect = function (url, response) {
            var expectation = new _Expectation(url, response);
            this._expectations.push(expectation);
        };
        /**
         * Add a definition for the given URL to return the given response. Unlike expectations,
         * definitions have no order and will satisfy any matching request at any time. Also
         * unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
         * to return an error.
         */
        MockXHR.prototype.when = function (url, response) { this._definitions.set(url, response); };
        /**
         * Process pending requests and verify there are no outstanding expectations. Also fails
         * if no requests are pending.
         */
        MockXHR.prototype.flush = function () {
            if (this._requests.length === 0) {
                throw new BaseException('No pending requests to flush');
            }
            do {
                this._processRequest(this._requests.shift());
            } while (this._requests.length > 0);
            this.verifyNoOutstandingExpectations();
        };
        /**
         * Throw an exception if any expectations have not been satisfied.
         */
        MockXHR.prototype.verifyNoOutstandingExpectations = function () {
            if (this._expectations.length === 0)
                return;
            var urls = [];
            for (var i = 0; i < this._expectations.length; i++) {
                var expectation = this._expectations[i];
                urls.push(expectation.url);
            }
            throw new BaseException("Unsatisfied requests: " + urls.join(', '));
        };
        MockXHR.prototype._processRequest = function (request) {
            var url = request.url;
            if (this._expectations.length > 0) {
                var expectation = this._expectations[0];
                if (expectation.url == url) {
                    ListWrapper.remove(this._expectations, expectation);
                    request.complete(expectation.response);
                    return;
                }
            }
            if (this._definitions.has(url)) {
                var response = this._definitions.get(url);
                request.complete(normalizeBlank(response));
                return;
            }
            throw new BaseException("Unexpected request " + url);
        };
        return MockXHR;
    }(_angular_compiler.XHR));
    var _PendingRequest = (function () {
        function _PendingRequest(url) {
            this.url = url;
            this.completer = PromiseWrapper.completer();
        }
        _PendingRequest.prototype.complete = function (response) {
            if (isBlank(response)) {
                this.completer.reject("Failed to load " + this.url, null);
            }
            else {
                this.completer.resolve(response);
            }
        };
        _PendingRequest.prototype.getPromise = function () { return this.completer.promise; };
        return _PendingRequest;
    }());
    var _Expectation = (function () {
        function _Expectation(url, response) {
            this.url = url;
            this.response = response;
        }
        return _Expectation;
    }());
    var __decorate$3 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$3 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * A mock implementation of {@link NgZone}.
     */
    exports.MockNgZone = (function (_super) {
        __extends(MockNgZone, _super);
        function MockNgZone() {
            _super.call(this, { enableLongStackTrace: false });
            /** @internal */
            this._mockOnStable = new EventEmitter(false);
        }
        Object.defineProperty(MockNgZone.prototype, "onStable", {
            get: function () { return this._mockOnStable; },
            enumerable: true,
            configurable: true
        });
        MockNgZone.prototype.run = function (fn) { return fn(); };
        MockNgZone.prototype.runOutsideAngular = function (fn) { return fn(); };
        MockNgZone.prototype.simulateZoneExit = function () { ObservableWrapper.callNext(this.onStable, null); };
        return MockNgZone;
    }(_angular_core.NgZone));
    exports.MockNgZone = __decorate$3([
        _angular_core.Injectable(),
        __metadata$3('design:paramtypes', [])
    ], exports.MockNgZone);
    var __decorate$4 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$4 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * A no-op implementation of {@link ApplicationRef}, useful for testing.
     */
    exports.MockApplicationRef = (function (_super) {
        __extends(MockApplicationRef, _super);
        function MockApplicationRef() {
            _super.apply(this, arguments);
        }
        MockApplicationRef.prototype.registerBootstrapListener = function (listener) { };
        MockApplicationRef.prototype.registerDisposeListener = function (dispose) { };
        MockApplicationRef.prototype.bootstrap = function (componentFactory) { return null; };
        Object.defineProperty(MockApplicationRef.prototype, "injector", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MockApplicationRef.prototype, "zone", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        ;
        MockApplicationRef.prototype.run = function (callback) { return null; };
        MockApplicationRef.prototype.waitForAsyncInitializers = function () { return null; };
        MockApplicationRef.prototype.dispose = function () { };
        MockApplicationRef.prototype.tick = function () { };
        Object.defineProperty(MockApplicationRef.prototype, "componentTypes", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        ;
        return MockApplicationRef;
    }(_angular_core.ApplicationRef));
    exports.MockApplicationRef = __decorate$4([
        _angular_core.Injectable(),
        __metadata$4('design:paramtypes', [])
    ], exports.MockApplicationRef);
    var __decorate$5 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$5 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * An implementation of {@link DirectiveResolver} that allows overriding
     * various properties of directives.
     */
    exports.MockDirectiveResolver = (function (_super) {
        __extends(MockDirectiveResolver, _super);
        function MockDirectiveResolver() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.apply(this, args);
            this._providerOverrides = new Map$1();
            this.viewProviderOverrides = new Map$1();
        }
        MockDirectiveResolver.prototype.resolve = function (type) {
            var dm = _super.prototype.resolve.call(this, type);
            var providerOverrides = this._providerOverrides.get(type);
            var viewProviderOverrides = this.viewProviderOverrides.get(type);
            var providers = dm.providers;
            if (isPresent(providerOverrides)) {
                var originalViewProviders = isPresent(dm.providers) ? dm.providers : [];
                providers = originalViewProviders.concat(providerOverrides);
            }
            if (dm instanceof _angular_core.ComponentMetadata) {
                var viewProviders = dm.viewProviders;
                if (isPresent(viewProviderOverrides)) {
                    var originalViewProviders = isPresent(dm.viewProviders) ? dm.viewProviders : [];
                    viewProviders = originalViewProviders.concat(viewProviderOverrides);
                }
                return new _angular_core.ComponentMetadata({
                    selector: dm.selector,
                    inputs: dm.inputs,
                    outputs: dm.outputs,
                    host: dm.host,
                    exportAs: dm.exportAs,
                    moduleId: dm.moduleId,
                    queries: dm.queries,
                    changeDetection: dm.changeDetection,
                    providers: providers,
                    viewProviders: viewProviders
                });
            }
            return new _angular_core.DirectiveMetadata({
                selector: dm.selector,
                inputs: dm.inputs,
                outputs: dm.outputs,
                host: dm.host,
                providers: providers,
                exportAs: dm.exportAs,
                queries: dm.queries
            });
        };
        /**
         * @deprecated
         */
        MockDirectiveResolver.prototype.setBindingsOverride = function (type, bindings) {
            this._providerOverrides.set(type, bindings);
        };
        /**
         * @deprecated
         */
        MockDirectiveResolver.prototype.setViewBindingsOverride = function (type, viewBindings) {
            this.viewProviderOverrides.set(type, viewBindings);
        };
        MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
            this._providerOverrides.set(type, providers);
        };
        MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
            this.viewProviderOverrides.set(type, viewProviders);
        };
        return MockDirectiveResolver;
    }(_angular_compiler.DirectiveResolver));
    exports.MockDirectiveResolver = __decorate$5([
        _angular_core.Injectable(),
        __metadata$5('design:paramtypes', [])
    ], exports.MockDirectiveResolver);
    var MockSchemaRegistry = (function () {
        function MockSchemaRegistry(existingProperties, attrPropMapping) {
            this.existingProperties = existingProperties;
            this.attrPropMapping = attrPropMapping;
        }
        MockSchemaRegistry.prototype.hasProperty = function (tagName, property) {
            var result = this.existingProperties[property];
            return isPresent(result) ? result : true;
        };
        MockSchemaRegistry.prototype.getMappedPropName = function (attrName) {
            var result = this.attrPropMapping[attrName];
            return isPresent(result) ? result : attrName;
        };
        return MockSchemaRegistry;
    }());
    var __decorate$6 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$6 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * A mock implementation of {@link LocationStrategy} that allows tests to fire simulated
     * location events.
     */
    exports.MockLocationStrategy = (function (_super) {
        __extends(MockLocationStrategy, _super);
        function MockLocationStrategy() {
            _super.call(this);
            this.internalBaseHref = '/';
            this.internalPath = '/';
            this.internalTitle = '';
            this.urlChanges = [];
            /** @internal */
            this._subject = new EventEmitter();
        }
        MockLocationStrategy.prototype.simulatePopState = function (url) {
            this.internalPath = url;
            ObservableWrapper.callEmit(this._subject, new _MockPopStateEvent(this.path()));
        };
        MockLocationStrategy.prototype.path = function () { return this.internalPath; };
        MockLocationStrategy.prototype.prepareExternalUrl = function (internal) {
            if (internal.startsWith('/') && this.internalBaseHref.endsWith('/')) {
                return this.internalBaseHref + internal.substring(1);
            }
            return this.internalBaseHref + internal;
        };
        MockLocationStrategy.prototype.pushState = function (ctx, title, path, query) {
            this.internalTitle = title;
            var url = path + (query.length > 0 ? ('?' + query) : '');
            this.internalPath = url;
            var externalUrl = this.prepareExternalUrl(url);
            this.urlChanges.push(externalUrl);
        };
        MockLocationStrategy.prototype.replaceState = function (ctx, title, path, query) {
            this.internalTitle = title;
            var url = path + (query.length > 0 ? ('?' + query) : '');
            this.internalPath = url;
            var externalUrl = this.prepareExternalUrl(url);
            this.urlChanges.push('replace: ' + externalUrl);
        };
        MockLocationStrategy.prototype.onPopState = function (fn) { ObservableWrapper.subscribe(this._subject, fn); };
        MockLocationStrategy.prototype.getBaseHref = function () { return this.internalBaseHref; };
        MockLocationStrategy.prototype.back = function () {
            if (this.urlChanges.length > 0) {
                this.urlChanges.pop();
                var nextUrl = this.urlChanges.length > 0 ? this.urlChanges[this.urlChanges.length - 1] : '';
                this.simulatePopState(nextUrl);
            }
        };
        MockLocationStrategy.prototype.forward = function () { throw 'not implemented'; };
        return MockLocationStrategy;
    }(_angular_common.LocationStrategy));
    exports.MockLocationStrategy = __decorate$6([
        _angular_core.Injectable(),
        __metadata$6('design:paramtypes', [])
    ], exports.MockLocationStrategy);
    var _MockPopStateEvent = (function () {
        function _MockPopStateEvent(newUrl) {
            this.newUrl = newUrl;
            this.pop = true;
            this.type = 'popstate';
        }
        return _MockPopStateEvent;
    }());
    var __decorate$7 = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata$7 = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(k, v);
    };
    /**
     * A spy for {@link Location} that allows tests to fire simulated location events.
     */
    exports.SpyLocation = (function () {
        function SpyLocation() {
            this.urlChanges = [];
            /** @internal */
            this._path = '';
            /** @internal */
            this._query = '';
            /** @internal */
            this._subject = new EventEmitter();
            /** @internal */
            this._baseHref = '';
            // TODO: remove these once Location is an interface, and can be implemented cleanly
            this.platformStrategy = null;
        }
        SpyLocation.prototype.setInitialPath = function (url) { this._path = url; };
        SpyLocation.prototype.setBaseHref = function (url) { this._baseHref = url; };
        SpyLocation.prototype.path = function () { return this._path; };
        SpyLocation.prototype.simulateUrlPop = function (pathname) {
            ObservableWrapper.callEmit(this._subject, { 'url': pathname, 'pop': true });
        };
        SpyLocation.prototype.simulateHashChange = function (pathname) {
            // Because we don't prevent the native event, the browser will independently update the path
            this.setInitialPath(pathname);
            this.urlChanges.push('hash: ' + pathname);
            ObservableWrapper.callEmit(this._subject, { 'url': pathname, 'pop': true, 'type': 'hashchange' });
        };
        SpyLocation.prototype.prepareExternalUrl = function (url) {
            if (url.length > 0 && !url.startsWith('/')) {
                url = '/' + url;
            }
            return this._baseHref + url;
        };
        SpyLocation.prototype.go = function (path, query) {
            if (query === void 0) { query = ''; }
            path = this.prepareExternalUrl(path);
            if (this._path == path && this._query == query) {
                return;
            }
            this._path = path;
            this._query = query;
            var url = path + (query.length > 0 ? ('?' + query) : '');
            this.urlChanges.push(url);
        };
        SpyLocation.prototype.replaceState = function (path, query) {
            if (query === void 0) { query = ''; }
            path = this.prepareExternalUrl(path);
            this._path = path;
            this._query = query;
            var url = path + (query.length > 0 ? ('?' + query) : '');
            this.urlChanges.push('replace: ' + url);
        };
        SpyLocation.prototype.forward = function () {
            // TODO
        };
        SpyLocation.prototype.back = function () {
            // TODO
        };
        SpyLocation.prototype.subscribe = function (onNext, onThrow, onReturn) {
            if (onThrow === void 0) { onThrow = null; }
            if (onReturn === void 0) { onReturn = null; }
            return ObservableWrapper.subscribe(this._subject, onNext, onThrow, onReturn);
        };
        SpyLocation.prototype.normalize = function (url) { return null; };
        return SpyLocation;
    }());
    exports.SpyLocation = __decorate$7([
        _angular_core.Injectable(),
        __metadata$7('design:paramtypes', [])
    ], exports.SpyLocation);
    exports.ComponentFixture = ComponentFixture;
    exports.MockXHR = MockXHR;
    exports.MockSchemaRegistry = MockSchemaRegistry;
    exports.afterEach = afterEach;
    exports.describe = describe;
    exports.ddescribe = ddescribe;
    exports.fdescribe = fdescribe;
    exports.xdescribe = xdescribe;
    exports.beforeEachProviders = beforeEachProviders;
    exports.beforeEach = beforeEach;
    exports.it = it;
    exports.xit = xit;
    exports.iit = iit;
    exports.fit = fit;
    exports.inject = inject;
    exports.async = async;
    exports.injectAsync = injectAsync;
    exports.expect = expect;
    exports.TestInjector = TestInjector;
    exports.getTestInjector = getTestInjector;
    exports.setBaseTestProviders = setBaseTestProviders;
    exports.resetBaseTestProviders = resetBaseTestProviders;
    exports.InjectSetupWrapper = InjectSetupWrapper;
    exports.withProviders = withProviders;
    exports.FunctionWithParamTokens = FunctionWithParamTokens;
    exports.fakeAsync = fakeAsync;
    exports.clearPendingTimers = clearPendingTimers;
    exports.tick = tick;
    exports.flushMicrotasks = flushMicrotasks;
}));
//# sourceMappingURL=testing.umd.js.map
