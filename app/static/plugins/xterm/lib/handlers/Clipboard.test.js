"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Clipboard = require("./Clipboard");
describe('evaluatePastedTextProcessing', function () {
    it('should replace carriage return + line feed with line feed on windows', function () {
        var pastedText = 'foo\r\nbar\r\n', processedText = Clipboard.prepareTextForTerminal(pastedText, false), windowsProcessedText = Clipboard.prepareTextForTerminal(pastedText, true);
        chai_1.assert.equal(processedText, 'foo\r\nbar\r\n');
        chai_1.assert.equal(windowsProcessedText, 'foo\rbar\r');
    });
});

//# sourceMappingURL=Clipboard.test.js.map
