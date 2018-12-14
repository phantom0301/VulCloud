"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LINE_DATA_CHAR_INDEX = 1;
var LINE_DATA_WIDTH_INDEX = 2;
function translateBufferLineToString(line, trimRight, startCol, endCol) {
    if (startCol === void 0) { startCol = 0; }
    if (endCol === void 0) { endCol = null; }
    var lineString = '';
    var widthAdjustedStartCol = startCol;
    var widthAdjustedEndCol = endCol;
    for (var i = 0; i < line.length; i++) {
        var char = line[i];
        lineString += char[LINE_DATA_CHAR_INDEX];
        if (char[LINE_DATA_WIDTH_INDEX] === 0) {
            if (startCol >= i) {
                widthAdjustedStartCol--;
            }
            if (endCol >= i) {
                widthAdjustedEndCol--;
            }
        }
    }
    var finalEndCol = widthAdjustedEndCol || line.length;
    if (trimRight) {
        var rightWhitespaceIndex = lineString.search(/\s+$/);
        if (rightWhitespaceIndex !== -1) {
            finalEndCol = Math.min(finalEndCol, rightWhitespaceIndex);
        }
        if (finalEndCol <= widthAdjustedStartCol) {
            return '';
        }
    }
    return lineString.substring(widthAdjustedStartCol, finalEndCol);
}
exports.translateBufferLineToString = translateBufferLineToString;

//# sourceMappingURL=BufferLine.js.map
