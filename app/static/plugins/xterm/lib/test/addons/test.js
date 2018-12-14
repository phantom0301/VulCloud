var assert = require('chai').assert;
var Terminal = require('../../xterm');
describe('xterm.js addons', function () {
    it('should load addons with Terminal.loadAddon', function () {
        Terminal.loadAddon('attach');
        assert.equal(typeof Terminal.prototype.attach, 'function');
    });
});

//# sourceMappingURL=test.js.map
