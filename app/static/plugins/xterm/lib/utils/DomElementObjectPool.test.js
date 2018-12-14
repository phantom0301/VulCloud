"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var DomElementObjectPool_1 = require("./DomElementObjectPool");
var MockDocument = (function () {
    function MockDocument() {
        this._attr = {};
    }
    MockDocument.prototype.getAttribute = function (key) { return this._attr[key]; };
    ;
    MockDocument.prototype.setAttribute = function (key, value) { this._attr[key] = value; };
    return MockDocument;
}());
describe('DomElementObjectPool', function () {
    var pool;
    beforeEach(function () {
        pool = new DomElementObjectPool_1.DomElementObjectPool('span');
        global.document = {
            createElement: function () { return new MockDocument(); }
        };
    });
    it('should acquire distinct elements', function () {
        var element1 = pool.acquire();
        var element2 = pool.acquire();
        chai_1.assert.notEqual(element1, element2);
    });
    it('should acquire released elements', function () {
        var element = pool.acquire();
        pool.release(element);
        chai_1.assert.equal(pool.acquire(), element);
    });
    it('should handle a series of acquisitions and releases', function () {
        var element1 = pool.acquire();
        var element2 = pool.acquire();
        pool.release(element1);
        chai_1.assert.equal(pool.acquire(), element1);
        pool.release(element1);
        pool.release(element2);
        chai_1.assert.equal(pool.acquire(), element2);
        chai_1.assert.equal(pool.acquire(), element1);
    });
    it('should throw when releasing an element that was not acquired', function () {
        chai_1.assert.throws(function () { return pool.release(document.createElement('span')); });
    });
});

//# sourceMappingURL=DomElementObjectPool.test.js.map
