(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "module"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.__tmp9z=global.__tmp9z || {};
        global.__tmp9z.generator = mod.exports;
    }
})(this, function (exports, module) {
    "use strict";

    var generator = {};

    /**
     * lazy find from an iterable collection using es6 generators
     * @param iterable {collection}
     * @param predicate {function}
     * @yields {object}
     */
    generator.find = regeneratorRuntime.mark(function callee$0$0(iterable, predicate) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

        return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    context$1$0.prev = 3;
                    _iterator = iterable[Symbol.iterator]();

                case 5:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        context$1$0.next = 13;
                        break;
                    }

                    item = _step.value;

                    if (!predicate(item)) {
                        context$1$0.next = 10;
                        break;
                    }

                    context$1$0.next = 10;
                    return item;

                case 10:
                    _iteratorNormalCompletion = true;
                    context$1$0.next = 5;
                    break;

                case 13:
                    context$1$0.next = 19;
                    break;

                case 15:
                    context$1$0.prev = 15;
                    context$1$0.t0 = context$1$0["catch"](3);
                    _didIteratorError = true;
                    _iteratorError = context$1$0.t0;

                case 19:
                    context$1$0.prev = 19;
                    context$1$0.prev = 20;

                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }

                case 22:
                    context$1$0.prev = 22;

                    if (!_didIteratorError) {
                        context$1$0.next = 25;
                        break;
                    }

                    throw _iteratorError;

                case 25:
                    return context$1$0.finish(22);

                case 26:
                    return context$1$0.finish(19);

                case 27:
                case "end":
                    return context$1$0.stop();
            }
        }, callee$0$0, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });

    /**
     * lazy select the first <number> of items to return from an iterable collection
     * @param iterable {collection}
     * @param number {int}
     * @yields {object}
     */
    generator.top = regeneratorRuntime.mark(function callee$0$0(iterable, number) {
        var count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

        return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
            while (1) switch (context$1$0.prev = context$1$0.next) {
                case 0:
                    count = 0;

                    if (!(number < 1)) {
                        context$1$0.next = 3;
                        break;
                    }

                    return context$1$0.abrupt("return");

                case 3:
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    context$1$0.prev = 6;
                    _iterator2 = iterable[Symbol.iterator]();

                case 8:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        context$1$0.next = 18;
                        break;
                    }

                    item = _step2.value;
                    context$1$0.next = 12;
                    return item;

                case 12:
                    count += 1;

                    if (!(count >= number)) {
                        context$1$0.next = 15;
                        break;
                    }

                    return context$1$0.abrupt("return");

                case 15:
                    _iteratorNormalCompletion2 = true;
                    context$1$0.next = 8;
                    break;

                case 18:
                    context$1$0.next = 24;
                    break;

                case 20:
                    context$1$0.prev = 20;
                    context$1$0.t0 = context$1$0["catch"](6);
                    _didIteratorError2 = true;
                    _iteratorError2 = context$1$0.t0;

                case 24:
                    context$1$0.prev = 24;
                    context$1$0.prev = 25;

                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }

                case 27:
                    context$1$0.prev = 27;

                    if (!_didIteratorError2) {
                        context$1$0.next = 30;
                        break;
                    }

                    throw _iteratorError2;

                case 30:
                    return context$1$0.finish(27);

                case 31:
                    return context$1$0.finish(24);

                case 32:
                case "end":
                    return context$1$0.stop();
            }
        }, callee$0$0, this, [[6, 20, 24, 32], [25,, 27, 31]]);
    });

    module.exports = generator;
});

//exits generator, sets done flag==true