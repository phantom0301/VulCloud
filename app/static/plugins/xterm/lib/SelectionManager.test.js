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
var jsdom = require("jsdom");
var chai_1 = require("chai");
var SelectionManager_1 = require("./SelectionManager");
var BufferSet_1 = require("./BufferSet");
var TestUtils_1 = require("./utils/TestUtils");
var TestSelectionManager = (function (_super) {
    __extends(TestSelectionManager, _super);
    function TestSelectionManager(terminal, buffer, rowContainer, charMeasure) {
        return _super.call(this, terminal, buffer, rowContainer, charMeasure) || this;
    }
    Object.defineProperty(TestSelectionManager.prototype, "model", {
        get: function () { return this._model; },
        enumerable: true,
        configurable: true
    });
    TestSelectionManager.prototype.selectLineAt = function (line) { this._selectLineAt(line); };
    TestSelectionManager.prototype.selectWordAt = function (coords) { this._selectWordAt(coords); };
    TestSelectionManager.prototype.enable = function () { };
    TestSelectionManager.prototype.disable = function () { };
    TestSelectionManager.prototype.refresh = function () { };
    return TestSelectionManager;
}(SelectionManager_1.SelectionManager));
describe('SelectionManager', function () {
    var dom;
    var window;
    var document;
    var terminal;
    var bufferLines;
    var rowContainer;
    var selectionManager;
    beforeEach(function () {
        dom = new jsdom.JSDOM('');
        window = dom.window;
        document = window.document;
        rowContainer = document.createElement('div');
        terminal = new TestUtils_1.MockTerminal();
        terminal.cols = 80;
        terminal.rows = 2;
        terminal.scrollback = 100;
        terminal.buffers = new BufferSet_1.BufferSet(terminal);
        terminal.buffer = terminal.buffers.active;
        bufferLines = terminal.buffer.lines;
        selectionManager = new TestSelectionManager(terminal, bufferLines, rowContainer, null);
    });
    function stringToRow(text) {
        var result = [];
        for (var i = 0; i < text.length; i++) {
            result.push([0, text.charAt(i), 1]);
        }
        return result;
    }
    describe('_selectWordAt', function () {
        it('should expand selection for normal width chars', function () {
            bufferLines.set(0, stringToRow('foo bar'));
            selectionManager.selectWordAt([0, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
            selectionManager.selectWordAt([1, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
            selectionManager.selectWordAt([2, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
            selectionManager.selectWordAt([3, 0]);
            chai_1.assert.equal(selectionManager.selectionText, ' ');
            selectionManager.selectWordAt([4, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'bar');
            selectionManager.selectWordAt([5, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'bar');
            selectionManager.selectWordAt([6, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'bar');
        });
        it('should expand selection for whitespace', function () {
            bufferLines.set(0, stringToRow('a   b'));
            selectionManager.selectWordAt([0, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a');
            selectionManager.selectWordAt([1, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '   ');
            selectionManager.selectWordAt([2, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '   ');
            selectionManager.selectWordAt([3, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '   ');
            selectionManager.selectWordAt([4, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'b');
        });
        it('should expand selection for wide characters', function () {
            bufferLines.set(0, [
                [null, '中', 2],
                [null, '', 0],
                [null, '文', 2],
                [null, '', 0],
                [null, ' ', 1],
                [null, 'a', 1],
                [null, '中', 2],
                [null, '', 0],
                [null, '文', 2],
                [null, '', 0],
                [null, 'b', 1],
                [null, ' ', 1],
                [null, 'f', 1],
                [null, 'o', 1],
                [null, 'o', 1]
            ]);
            selectionManager.selectWordAt([0, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '中文');
            selectionManager.selectWordAt([1, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '中文');
            selectionManager.selectWordAt([2, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '中文');
            selectionManager.selectWordAt([3, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '中文');
            selectionManager.selectWordAt([4, 0]);
            chai_1.assert.equal(selectionManager.selectionText, ' ');
            selectionManager.selectWordAt([5, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([6, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([7, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([8, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([9, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([10, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'a中文b');
            selectionManager.selectWordAt([11, 0]);
            chai_1.assert.equal(selectionManager.selectionText, ' ');
            selectionManager.selectWordAt([12, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
            selectionManager.selectWordAt([13, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
            selectionManager.selectWordAt([14, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'foo');
        });
        it('should select up to non-path characters that are commonly adjacent to paths', function () {
            bufferLines.set(0, stringToRow('(cd)[ef]{gh}\'ij"'));
            selectionManager.selectWordAt([0, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '(cd');
            selectionManager.selectWordAt([1, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'cd');
            selectionManager.selectWordAt([2, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'cd');
            selectionManager.selectWordAt([3, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'cd)');
            selectionManager.selectWordAt([4, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '[ef');
            selectionManager.selectWordAt([5, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ef');
            selectionManager.selectWordAt([6, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ef');
            selectionManager.selectWordAt([7, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ef]');
            selectionManager.selectWordAt([8, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '{gh');
            selectionManager.selectWordAt([9, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'gh');
            selectionManager.selectWordAt([10, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'gh');
            selectionManager.selectWordAt([11, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'gh}');
            selectionManager.selectWordAt([12, 0]);
            chai_1.assert.equal(selectionManager.selectionText, '\'ij');
            selectionManager.selectWordAt([13, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ij');
            selectionManager.selectWordAt([14, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ij');
            selectionManager.selectWordAt([15, 0]);
            chai_1.assert.equal(selectionManager.selectionText, 'ij"');
        });
    });
    describe('_selectLineAt', function () {
        it('should select the entire line', function () {
            bufferLines.set(0, stringToRow('foo bar'));
            selectionManager.selectLineAt(0);
            chai_1.assert.equal(selectionManager.selectionText, 'foo bar', 'The selected text is correct');
            chai_1.assert.deepEqual(selectionManager.model.finalSelectionStart, [0, 0]);
            chai_1.assert.deepEqual(selectionManager.model.finalSelectionEnd, [terminal.cols, 0], 'The actual selection spans the entire column');
        });
    });
    describe('selectAll', function () {
        it('should select the entire buffer, beyond the viewport', function () {
            bufferLines.length = 5;
            bufferLines.set(0, stringToRow('1'));
            bufferLines.set(1, stringToRow('2'));
            bufferLines.set(2, stringToRow('3'));
            bufferLines.set(3, stringToRow('4'));
            bufferLines.set(4, stringToRow('5'));
            selectionManager.selectAll();
            terminal.buffer.ybase = bufferLines.length - terminal.rows;
            chai_1.assert.equal(selectionManager.selectionText, '1\n2\n3\n4\n5');
        });
    });
    describe('hasSelection', function () {
        it('should return whether there is a selection', function () {
            selectionManager.model.selectionStart = [0, 0];
            selectionManager.model.selectionStartLength = 0;
            chai_1.assert.equal(selectionManager.hasSelection, false);
            selectionManager.model.selectionEnd = [0, 0];
            chai_1.assert.equal(selectionManager.hasSelection, false);
            selectionManager.model.selectionEnd = [1, 0];
            chai_1.assert.equal(selectionManager.hasSelection, true);
            selectionManager.model.selectionEnd = [0, 1];
            chai_1.assert.equal(selectionManager.hasSelection, true);
            selectionManager.model.selectionEnd = [1, 1];
            chai_1.assert.equal(selectionManager.hasSelection, true);
        });
    });
});

//# sourceMappingURL=SelectionManager.test.js.map
