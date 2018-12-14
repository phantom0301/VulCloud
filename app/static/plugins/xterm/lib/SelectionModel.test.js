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
var chai_1 = require("chai");
var SelectionModel_1 = require("./SelectionModel");
var BufferSet_1 = require("./BufferSet");
var TestUtils_1 = require("./utils/TestUtils");
var TestSelectionModel = (function (_super) {
    __extends(TestSelectionModel, _super);
    function TestSelectionModel(terminal) {
        return _super.call(this, terminal) || this;
    }
    return TestSelectionModel;
}(SelectionModel_1.SelectionModel));
describe('SelectionManager', function () {
    var window;
    var document;
    var terminal;
    var model;
    beforeEach(function () {
        terminal = new TestUtils_1.MockTerminal();
        terminal.cols = 80;
        terminal.rows = 2;
        terminal.scrollback = 10;
        terminal.buffers = new BufferSet_1.BufferSet(terminal);
        terminal.buffer = terminal.buffers.active;
        model = new TestSelectionModel(terminal);
    });
    describe('clearSelection', function () {
        it('should clear the final selection', function () {
            model.selectionStart = [0, 0];
            model.selectionEnd = [10, 2];
            chai_1.assert.deepEqual(model.finalSelectionStart, [0, 0]);
            chai_1.assert.deepEqual(model.finalSelectionEnd, [10, 2]);
            model.clearSelection();
            chai_1.assert.deepEqual(model.finalSelectionStart, null);
            chai_1.assert.deepEqual(model.finalSelectionEnd, null);
        });
    });
    describe('areSelectionValuesReversed', function () {
        it('should return true when the selection end is before selection start', function () {
            model.selectionStart = [1, 0];
            model.selectionEnd = [0, 0];
            chai_1.assert.equal(model.areSelectionValuesReversed(), true);
            model.selectionStart = [10, 2];
            model.selectionEnd = [0, 0];
            chai_1.assert.equal(model.areSelectionValuesReversed(), true);
        });
        it('should return false when the selection end is after selection start', function () {
            model.selectionStart = [0, 0];
            model.selectionEnd = [1, 0];
            chai_1.assert.equal(model.areSelectionValuesReversed(), false);
            model.selectionStart = [0, 0];
            model.selectionEnd = [10, 2];
            chai_1.assert.equal(model.areSelectionValuesReversed(), false);
        });
    });
    describe('onTrim', function () {
        it('should trim a portion of the selection when a part of it is trimmed', function () {
            model.selectionStart = [0, 0];
            model.selectionEnd = [10, 2];
            model.onTrim(1);
            chai_1.assert.deepEqual(model.finalSelectionStart, [0, 0]);
            chai_1.assert.deepEqual(model.finalSelectionEnd, [10, 1]);
            model.onTrim(1);
            chai_1.assert.deepEqual(model.finalSelectionStart, [0, 0]);
            chai_1.assert.deepEqual(model.finalSelectionEnd, [10, 0]);
        });
        it('should clear selection when it is trimmed in its entirety', function () {
            model.selectionStart = [0, 0];
            model.selectionEnd = [10, 0];
            model.onTrim(1);
            chai_1.assert.deepEqual(model.finalSelectionStart, null);
            chai_1.assert.deepEqual(model.finalSelectionEnd, null);
        });
    });
    describe('finalSelectionStart', function () {
        it('should return the start of the buffer if select all is active', function () {
            model.isSelectAllActive = true;
            chai_1.assert.deepEqual(model.finalSelectionStart, [0, 0]);
        });
        it('should return selection start if there is no selection end', function () {
            model.selectionStart = [2, 2];
            chai_1.assert.deepEqual(model.finalSelectionStart, [2, 2]);
        });
        it('should return selection end if values are reversed', function () {
            model.selectionStart = [2, 2];
            model.selectionEnd = [3, 2];
            chai_1.assert.deepEqual(model.finalSelectionStart, [2, 2]);
            model.selectionEnd = [1, 2];
            chai_1.assert.deepEqual(model.finalSelectionStart, [1, 2]);
        });
    });
    describe('finalSelectionEnd', function () {
        it('should return the end of the buffer if select all is active', function () {
            model.isSelectAllActive = true;
            chai_1.assert.deepEqual(model.finalSelectionEnd, [80, 1]);
        });
        it('should return null if there is no selection start', function () {
            chai_1.assert.equal(model.finalSelectionEnd, null);
            model.selectionEnd = [1, 2];
            chai_1.assert.equal(model.finalSelectionEnd, null);
        });
        it('should return selection start + length if there is no selection end', function () {
            model.selectionStart = [2, 2];
            model.selectionStartLength = 2;
            chai_1.assert.deepEqual(model.finalSelectionEnd, [4, 2]);
        });
        it('should return selection start + length if values are reversed', function () {
            model.selectionStart = [2, 2];
            model.selectionStartLength = 2;
            model.selectionEnd = [2, 1];
            chai_1.assert.deepEqual(model.finalSelectionEnd, [4, 2]);
        });
        it('should return selection start + length if selection end is inside the start selection', function () {
            model.selectionStart = [2, 2];
            model.selectionStartLength = 2;
            model.selectionEnd = [3, 2];
            chai_1.assert.deepEqual(model.finalSelectionEnd, [4, 2]);
        });
        it('should return selection end if selection end is after selection start + length', function () {
            model.selectionStart = [2, 2];
            model.selectionStartLength = 2;
            model.selectionEnd = [5, 2];
            chai_1.assert.deepEqual(model.finalSelectionEnd, [5, 2]);
        });
    });
});

//# sourceMappingURL=SelectionModel.test.js.map
