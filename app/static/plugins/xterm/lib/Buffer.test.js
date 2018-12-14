"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Buffer_1 = require("./Buffer");
var CircularList_1 = require("./utils/CircularList");
var TestUtils_1 = require("./utils/TestUtils");
var INIT_COLS = 80;
var INIT_ROWS = 24;
describe('Buffer', function () {
    var terminal;
    var buffer;
    beforeEach(function () {
        terminal = new TestUtils_1.MockTerminal();
        terminal.cols = INIT_COLS;
        terminal.rows = INIT_ROWS;
        terminal.scrollback = 1000;
        buffer = new Buffer_1.Buffer(terminal);
    });
    describe('constructor', function () {
        it('should create a CircularList with max length equal to scrollback, for its lines', function () {
            chai_1.assert.instanceOf(buffer.lines, CircularList_1.CircularList);
            chai_1.assert.equal(buffer.lines.maxLength, terminal.scrollback);
        });
        it('should set the Buffer\'s scrollBottom value equal to the terminal\'s rows -1', function () {
            chai_1.assert.equal(buffer.scrollBottom, terminal.rows - 1);
        });
    });
    describe('fillViewportRows', function () {
        it('should fill the buffer with blank lines based on the size of the viewport', function () {
            var blankLineChar = terminal.blankLine()[0];
            buffer.fillViewportRows();
            chai_1.assert.equal(buffer.lines.length, INIT_ROWS);
            for (var y = 0; y < INIT_ROWS; y++) {
                chai_1.assert.equal(buffer.lines.get(y).length, INIT_COLS);
                for (var x = 0; x < INIT_COLS; x++) {
                    chai_1.assert.deepEqual(buffer.lines.get(y)[x], blankLineChar);
                }
            }
        });
    });
    describe('resize', function () {
        describe('column size is reduced', function () {
            it('should not trim the data in the buffer', function () {
                buffer.fillViewportRows();
                buffer.resize(INIT_COLS / 2, INIT_ROWS);
                chai_1.assert.equal(buffer.lines.length, INIT_ROWS);
                for (var i = 0; i < INIT_ROWS; i++) {
                    chai_1.assert.equal(buffer.lines.get(i).length, INIT_COLS);
                }
            });
        });
        describe('column size is increased', function () {
            it('should add pad columns', function () {
                buffer.fillViewportRows();
                buffer.resize(INIT_COLS + 10, INIT_ROWS);
                chai_1.assert.equal(buffer.lines.length, INIT_ROWS);
                for (var i = 0; i < INIT_ROWS; i++) {
                    chai_1.assert.equal(buffer.lines.get(i).length, INIT_COLS + 10);
                }
            });
        });
        describe('row size reduced', function () {
            it('should trim blank lines from the end', function () {
                buffer.fillViewportRows();
                buffer.resize(INIT_COLS, INIT_ROWS - 10);
                chai_1.assert.equal(buffer.lines.length, INIT_ROWS - 10);
            });
            it('should move the viewport down when it\'s at the end', function () {
                buffer.fillViewportRows();
                buffer.y = INIT_ROWS - 5 - 1;
                buffer.resize(INIT_COLS, INIT_ROWS - 10);
                chai_1.assert.equal(buffer.lines.length, INIT_ROWS - 5);
                chai_1.assert.equal(buffer.ydisp, 5);
                chai_1.assert.equal(buffer.ybase, 5);
            });
        });
        describe('row size increased', function () {
            describe('empty buffer', function () {
                it('should add blank lines to end', function () {
                    buffer.fillViewportRows();
                    chai_1.assert.equal(buffer.ydisp, 0);
                    buffer.resize(INIT_COLS, INIT_ROWS + 10);
                    chai_1.assert.equal(buffer.ydisp, 0);
                    chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 10);
                });
            });
            describe('filled buffer', function () {
                it('should show more of the buffer above', function () {
                    buffer.fillViewportRows();
                    for (var i = 0; i < 10; i++) {
                        buffer.lines.push(terminal.blankLine());
                    }
                    buffer.y = INIT_ROWS - 1;
                    buffer.ybase = 10;
                    buffer.ydisp = 10;
                    chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 10);
                    buffer.resize(INIT_COLS, INIT_ROWS + 5);
                    chai_1.assert.equal(buffer.ydisp, 5);
                    chai_1.assert.equal(buffer.ybase, 5);
                    chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 10);
                });
                it('should show more of the buffer below when the viewport is at the top of the buffer', function () {
                    buffer.fillViewportRows();
                    for (var i = 0; i < 10; i++) {
                        buffer.lines.push(terminal.blankLine());
                    }
                    buffer.y = INIT_ROWS - 1;
                    buffer.ybase = 10;
                    buffer.ydisp = 0;
                    chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 10);
                    buffer.resize(INIT_COLS, INIT_ROWS + 5);
                    chai_1.assert.equal(buffer.ydisp, 0);
                    chai_1.assert.equal(buffer.ybase, 5);
                    chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 10);
                });
            });
        });
        describe('row and column increased', function () {
            it('should resize properly', function () {
                buffer.fillViewportRows();
                buffer.resize(INIT_COLS + 5, INIT_ROWS + 5);
                chai_1.assert.equal(buffer.lines.length, INIT_ROWS + 5);
                for (var i = 0; i < INIT_ROWS + 5; i++) {
                    chai_1.assert.equal(buffer.lines.get(i).length, INIT_COLS + 5);
                }
            });
        });
    });
});

//# sourceMappingURL=Buffer.test.js.map
