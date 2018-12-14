"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var BufferSet_1 = require("./BufferSet");
var Buffer_1 = require("./Buffer");
var TestUtils_1 = require("./utils/TestUtils");
describe('BufferSet', function () {
    var terminal;
    var bufferSet;
    beforeEach(function () {
        terminal = new TestUtils_1.MockTerminal();
        terminal.cols = 80;
        terminal.rows = 24;
        terminal.scrollback = 1000;
        bufferSet = new BufferSet_1.BufferSet(terminal);
    });
    describe('constructor', function () {
        it('should create two different buffers: alt and normal', function () {
            chai_1.assert.instanceOf(bufferSet.normal, Buffer_1.Buffer);
            chai_1.assert.instanceOf(bufferSet.alt, Buffer_1.Buffer);
            chai_1.assert.notEqual(bufferSet.normal, bufferSet.alt);
        });
    });
    describe('activateNormalBuffer', function () {
        beforeEach(function () {
            bufferSet.activateNormalBuffer();
        });
        it('should set the normal buffer as the currently active buffer', function () {
            chai_1.assert.equal(bufferSet.active, bufferSet.normal);
        });
    });
    describe('activateAltBuffer', function () {
        beforeEach(function () {
            bufferSet.activateAltBuffer();
        });
        it('should set the alt buffer as the currently active buffer', function () {
            chai_1.assert.equal(bufferSet.active, bufferSet.alt);
        });
    });
});

//# sourceMappingURL=BufferSet.test.js.map
