"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var CircularList_1 = require("./CircularList");
describe('CircularList', function () {
    describe('push', function () {
        it('should push values onto the array', function () {
            var list = new CircularList_1.CircularList(5);
            list.push('1');
            list.push('2');
            list.push('3');
            list.push('4');
            list.push('5');
            chai_1.assert.equal(list.get(0), '1');
            chai_1.assert.equal(list.get(1), '2');
            chai_1.assert.equal(list.get(2), '3');
            chai_1.assert.equal(list.get(3), '4');
            chai_1.assert.equal(list.get(4), '5');
        });
        it('should push old values from the start out of the array when max length is reached', function () {
            var list = new CircularList_1.CircularList(2);
            list.push('1');
            list.push('2');
            chai_1.assert.equal(list.get(0), '1');
            chai_1.assert.equal(list.get(1), '2');
            list.push('3');
            chai_1.assert.equal(list.get(0), '2');
            chai_1.assert.equal(list.get(1), '3');
            list.push('4');
            chai_1.assert.equal(list.get(0), '3');
            chai_1.assert.equal(list.get(1), '4');
        });
    });
    describe('maxLength', function () {
        it('should increase the size of the list', function () {
            var list = new CircularList_1.CircularList(2);
            list.push('1');
            list.push('2');
            chai_1.assert.equal(list.get(0), '1');
            chai_1.assert.equal(list.get(1), '2');
            list.maxLength = 4;
            list.push('3');
            list.push('4');
            chai_1.assert.equal(list.get(0), '1');
            chai_1.assert.equal(list.get(1), '2');
            chai_1.assert.equal(list.get(2), '3');
            chai_1.assert.equal(list.get(3), '4');
            list.push('wrapped');
            chai_1.assert.equal(list.get(0), '2');
            chai_1.assert.equal(list.get(1), '3');
            chai_1.assert.equal(list.get(2), '4');
            chai_1.assert.equal(list.get(3), 'wrapped');
        });
        it('should return the maximum length of the list', function () {
            var list = new CircularList_1.CircularList(2);
            chai_1.assert.equal(list.maxLength, 2);
            list.push('1');
            list.push('2');
            chai_1.assert.equal(list.maxLength, 2);
            list.push('3');
            chai_1.assert.equal(list.maxLength, 2);
            list.maxLength = 4;
            chai_1.assert.equal(list.maxLength, 4);
        });
    });
    describe('length', function () {
        it('should return the current length of the list, capped at the maximum length', function () {
            var list = new CircularList_1.CircularList(2);
            chai_1.assert.equal(list.length, 0);
            list.push('1');
            chai_1.assert.equal(list.length, 1);
            list.push('2');
            chai_1.assert.equal(list.length, 2);
            list.push('3');
            chai_1.assert.equal(list.length, 2);
        });
    });
    describe('splice', function () {
        it('should delete items', function () {
            var list = new CircularList_1.CircularList(2);
            list.push('1');
            list.push('2');
            list.splice(0, 1);
            chai_1.assert.equal(list.length, 1);
            chai_1.assert.equal(list.get(0), '2');
            list.push('3');
            list.splice(1, 1);
            chai_1.assert.equal(list.length, 1);
            chai_1.assert.equal(list.get(0), '2');
        });
        it('should insert items', function () {
            var list = new CircularList_1.CircularList(2);
            list.push('1');
            list.splice(0, 0, '2');
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.equal(list.get(0), '2');
            chai_1.assert.equal(list.get(1), '1');
            list.splice(1, 0, '3');
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.equal(list.get(0), '3');
            chai_1.assert.equal(list.get(1), '1');
        });
        it('should delete items then insert items', function () {
            var list = new CircularList_1.CircularList(3);
            list.push('1');
            list.push('2');
            list.splice(0, 1, '3', '4');
            chai_1.assert.equal(list.length, 3);
            chai_1.assert.equal(list.get(0), '3');
            chai_1.assert.equal(list.get(1), '4');
            chai_1.assert.equal(list.get(2), '2');
        });
        it('should wrap the array correctly when more items are inserted than deleted', function () {
            var list = new CircularList_1.CircularList(3);
            list.push('1');
            list.push('2');
            list.splice(1, 0, '3', '4');
            chai_1.assert.equal(list.length, 3);
            chai_1.assert.equal(list.get(0), '3');
            chai_1.assert.equal(list.get(1), '4');
            chai_1.assert.equal(list.get(2), '2');
        });
    });
    describe('trimStart', function () {
        it('should remove items from the beginning of the list', function () {
            var list = new CircularList_1.CircularList(5);
            list.push('1');
            list.push('2');
            list.push('3');
            list.push('4');
            list.push('5');
            list.trimStart(1);
            chai_1.assert.equal(list.length, 4);
            chai_1.assert.deepEqual(list.get(0), '2');
            chai_1.assert.deepEqual(list.get(1), '3');
            chai_1.assert.deepEqual(list.get(2), '4');
            chai_1.assert.deepEqual(list.get(3), '5');
            list.trimStart(2);
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.deepEqual(list.get(0), '4');
            chai_1.assert.deepEqual(list.get(1), '5');
        });
        it('should remove all items if the requested trim amount is larger than the list\'s length', function () {
            var list = new CircularList_1.CircularList(5);
            list.push('1');
            list.trimStart(2);
            chai_1.assert.equal(list.length, 0);
        });
    });
    describe('shiftElements', function () {
        it('should not mutate the list when count is 0', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.shiftElements(0, 0, 1);
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.equal(list.get(0), 1);
            chai_1.assert.equal(list.get(1), 2);
        });
        it('should throw for invalid args', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            chai_1.assert.throws(function () { return list.shiftElements(-1, 1, 1); }, 'start argument out of range');
            chai_1.assert.throws(function () { return list.shiftElements(1, 1, 1); }, 'start argument out of range');
            chai_1.assert.throws(function () { return list.shiftElements(0, 1, -1); }, 'Cannot shift elements in list beyond index 0');
        });
        it('should shift an element forward', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.shiftElements(0, 1, 1);
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.equal(list.get(0), 1);
            chai_1.assert.equal(list.get(1), 1);
        });
        it('should shift elements forward', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.push(3);
            list.push(4);
            list.shiftElements(0, 2, 2);
            chai_1.assert.equal(list.length, 4);
            chai_1.assert.equal(list.get(0), 1);
            chai_1.assert.equal(list.get(1), 2);
            chai_1.assert.equal(list.get(2), 1);
            chai_1.assert.equal(list.get(3), 2);
        });
        it('should shift elements forward, expanding the list if needed', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.shiftElements(0, 2, 2);
            chai_1.assert.equal(list.length, 4);
            chai_1.assert.equal(list.get(0), 1);
            chai_1.assert.equal(list.get(1), 2);
            chai_1.assert.equal(list.get(2), 1);
            chai_1.assert.equal(list.get(3), 2);
        });
        it('should shift elements forward, wrapping the list if needed', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.push(3);
            list.push(4);
            list.push(5);
            list.shiftElements(2, 2, 3);
            chai_1.assert.equal(list.length, 5);
            chai_1.assert.equal(list.get(0), 3);
            chai_1.assert.equal(list.get(1), 4);
            chai_1.assert.equal(list.get(2), 5);
            chai_1.assert.equal(list.get(3), 3);
            chai_1.assert.equal(list.get(4), 4);
        });
        it('should shift an element backwards', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.shiftElements(1, 1, -1);
            chai_1.assert.equal(list.length, 2);
            chai_1.assert.equal(list.get(0), 2);
            chai_1.assert.equal(list.get(1), 2);
        });
        it('should shift elements backwards', function () {
            var list = new CircularList_1.CircularList(5);
            list.push(1);
            list.push(2);
            list.push(3);
            list.push(4);
            list.shiftElements(2, 2, -2);
            chai_1.assert.equal(list.length, 4);
            chai_1.assert.equal(list.get(0), 3);
            chai_1.assert.equal(list.get(1), 4);
            chai_1.assert.equal(list.get(2), 3);
            chai_1.assert.equal(list.get(3), 4);
        });
    });
});

//# sourceMappingURL=CircularList.test.js.map
