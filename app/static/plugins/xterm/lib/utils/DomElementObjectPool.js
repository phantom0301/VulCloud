"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomElementObjectPool = (function () {
    function DomElementObjectPool(type) {
        this.type = type;
        this._type = type;
        this._pool = [];
        this._inUse = {};
    }
    DomElementObjectPool.prototype.acquire = function () {
        var element;
        if (this._pool.length === 0) {
            element = this._createNew();
        }
        else {
            element = this._pool.pop();
        }
        this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)] = element;
        return element;
    };
    DomElementObjectPool.prototype.release = function (element) {
        if (!this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)]) {
            throw new Error('Could not release an element not yet acquired');
        }
        delete this._inUse[element.getAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE)];
        this._cleanElement(element);
        this._pool.push(element);
    };
    DomElementObjectPool.prototype._createNew = function () {
        var element = document.createElement(this._type);
        var id = DomElementObjectPool._objectCount++;
        element.setAttribute(DomElementObjectPool.OBJECT_ID_ATTRIBUTE, id.toString(10));
        return element;
    };
    DomElementObjectPool.prototype._cleanElement = function (element) {
        element.className = '';
        element.innerHTML = '';
    };
    return DomElementObjectPool;
}());
DomElementObjectPool.OBJECT_ID_ATTRIBUTE = 'data-obj-id';
DomElementObjectPool._objectCount = 0;
exports.DomElementObjectPool = DomElementObjectPool;

//# sourceMappingURL=DomElementObjectPool.js.map
