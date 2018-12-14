"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom = require("jsdom");
var chai_1 = require("chai");
var CharMeasure_1 = require("./CharMeasure");
describe('CharMeasure', function () {
    var dom;
    var window;
    var document;
    var container;
    var charMeasure;
    beforeEach(function () {
        dom = new jsdom.JSDOM('');
        window = dom.window;
        document = window.document;
        container = document.createElement('div');
        document.body.appendChild(container);
        charMeasure = new CharMeasure_1.CharMeasure(document, container);
    });
    describe('measure', function () {
        it('should set _measureElement on first call', function () {
            charMeasure.measure();
            chai_1.assert.isDefined(charMeasure._measureElement, 'CharMeasure.measure should have created _measureElement');
        });
        it('should be performed async on first call', function (done) {
            chai_1.assert.equal(charMeasure.width, null);
            charMeasure.measure();
            charMeasure._measureElement.getBoundingClientRect = function () {
                return { width: 1, height: 1 };
            };
            chai_1.assert.equal(charMeasure.width, null);
            setTimeout(function () {
                chai_1.assert.equal(charMeasure.width, 1);
                done();
            }, 0);
        });
        it('should be performed sync on successive calls', function (done) {
            charMeasure.measure();
            charMeasure._measureElement.getBoundingClientRect = function () {
                return { width: 1, height: 1 };
            };
            setTimeout(function () {
                var firstWidth = charMeasure.width;
                charMeasure._measureElement.getBoundingClientRect = function () {
                    return { width: 2, height: 2 };
                };
                charMeasure.measure();
                chai_1.assert.equal(charMeasure.width, firstWidth * 2);
                done();
            }, 0);
        });
        it('should NOT do a measure when the parent is hidden', function (done) {
            charMeasure.measure();
            setTimeout(function () {
                var firstWidth = charMeasure.width;
                container.style.display = 'none';
                container.style.fontSize = '2em';
                charMeasure.measure();
                chai_1.assert.equal(charMeasure.width, firstWidth);
                done();
            }, 0);
        });
    });
});

//# sourceMappingURL=CharMeasure.test.js.map
