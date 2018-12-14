"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = require("../EventEmitter");
var CircularList = (function (_super) {
    __extends(CircularList, _super);
    function CircularList(maxLength) {
        var _this = _super.call(this) || this;
        _this._array = new Array(maxLength);
        _this._startIndex = 0;
        _this._length = 0;
        return _this;
    }
    Object.defineProperty(CircularList.prototype, "maxLength", {
        get: function () {
            return this._array.length;
        },
        set: function (newMaxLength) {
            var newArray = new Array(newMaxLength);
            for (var i = 0; i < Math.min(newMaxLength, this.length); i++) {
                newArray[i] = this._array[this._getCyclicIndex(i)];
            }
            this._array = newArray;
            this._startIndex = 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CircularList.prototype, "length", {
        get: function () {
            return this._length;
        },
        set: function (newLength) {
            if (newLength > this._length) {
                for (var i = this._length; i < newLength; i++) {
                    this._array[i] = undefined;
                }
            }
            this._length = newLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CircularList.prototype, "forEach", {
        get: function () {
            var _this = this;
            return function (callbackfn) {
                var i = 0;
                var length = _this.length;
                for (var i_1 = 0; i_1 < length; i_1++) {
                    callbackfn(_this.get(i_1), i_1);
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    CircularList.prototype.get = function (index) {
        return this._array[this._getCyclicIndex(index)];
    };
    CircularList.prototype.set = function (index, value) {
        this._array[this._getCyclicIndex(index)] = value;
    };
    CircularList.prototype.push = function (value) {
        this._array[this._getCyclicIndex(this._length)] = value;
        if (this._length === this.maxLength) {
            this._startIndex++;
            if (this._startIndex === this.maxLength) {
                this._startIndex = 0;
            }
            this.emit('trim', 1);
        }
        else {
            this._length++;
        }
    };
    CircularList.prototype.pop = function () {
        return this._array[this._getCyclicIndex(this._length-- - 1)];
    };
    CircularList.prototype.splice = function (start, deleteCount) {
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        if (deleteCount) {
            for (var i = start; i < this._length - deleteCount; i++) {
                this._array[this._getCyclicIndex(i)] = this._array[this._getCyclicIndex(i + deleteCount)];
            }
            this._length -= deleteCount;
        }
        if (items && items.length) {
            for (var i = this._length - 1; i >= start; i--) {
                this._array[this._getCyclicIndex(i + items.length)] = this._array[this._getCyclicIndex(i)];
            }
            for (var i = 0; i < items.length; i++) {
                this._array[this._getCyclicIndex(start + i)] = items[i];
            }
            if (this._length + items.length > this.maxLength) {
                var countToTrim = (this._length + items.length) - this.maxLength;
                this._startIndex += countToTrim;
                this._length = this.maxLength;
                this.emit('trim', countToTrim);
            }
            else {
                this._length += items.length;
            }
        }
    };
    CircularList.prototype.trimStart = function (count) {
        if (count > this._length) {
            count = this._length;
        }
        this._startIndex += count;
        this._length -= count;
        this.emit('trim', count);
    };
    CircularList.prototype.shiftElements = function (start, count, offset) {
        if (count <= 0) {
            return;
        }
        if (start < 0 || start >= this._length) {
            throw new Error('start argument out of range');
        }
        if (start + offset < 0) {
            throw new Error('Cannot shift elements in list beyond index 0');
        }
        if (offset > 0) {
            for (var i = count - 1; i >= 0; i--) {
                this.set(start + i + offset, this.get(start + i));
            }
            var expandListBy = (start + count + offset) - this._length;
            if (expandListBy > 0) {
                this._length += expandListBy;
                while (this._length > this.maxLength) {
                    this._length--;
                    this._startIndex++;
                    this.emit('trim', 1);
                }
            }
        }
        else {
            for (var i = 0; i < count; i++) {
                this.set(start + i + offset, this.get(start + i));
            }
        }
    };
    CircularList.prototype._getCyclicIndex = function (index) {
        return (this._startIndex + index) % this.maxLength;
    };
    return CircularList;
}(EventEmitter_1.EventEmitter));
exports.CircularList = CircularList;

//# sourceMappingURL=CircularList.js.map
