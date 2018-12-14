"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockTerminal = (function () {
    function MockTerminal() {
    }
    MockTerminal.prototype.handler = function (data) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.on = function (event, callback) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.scrollDisp = function (disp, suppressScrollEvent) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.cancel = function (ev, force) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.log = function (text) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.emit = function (event, data) {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.reset = function () {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.showCursor = function () {
        throw new Error('Method not implemented.');
    };
    MockTerminal.prototype.blankLine = function (cur, isWrapped, cols) {
        var line = [];
        cols = cols || this.cols;
        for (var i = 0; i < cols; i++) {
            line.push([0, ' ', 1]);
        }
        return line;
    };
    return MockTerminal;
}());
exports.MockTerminal = MockTerminal;

//# sourceMappingURL=TestUtils.js.map
