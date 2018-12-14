"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var EventEmitter_1 = require("./EventEmitter");
describe('EventEmitter', function () {
    var eventEmitter;
    beforeEach(function () {
        eventEmitter = new EventEmitter_1.EventEmitter();
    });
    describe('once', function () {
        it('should trigger the listener only once', function () {
            var count = 0;
            var listener = function () { return count++; };
            eventEmitter.once('test', listener);
            eventEmitter.emit('test');
            chai_1.assert.equal(count, 1);
            eventEmitter.emit('test');
            chai_1.assert.equal(count, 1);
        });
    });
    describe('emit', function () {
        it('should emit events to listeners', function () {
            var count1 = 0;
            var count2 = 0;
            var listener1 = function () { return count1++; };
            var listener2 = function () { return count2++; };
            eventEmitter.on('test', listener1);
            eventEmitter.on('test', listener2);
            eventEmitter.emit('test');
            chai_1.assert.equal(count1, 1);
            chai_1.assert.equal(count2, 1);
            eventEmitter.emit('test');
            chai_1.assert.equal(count1, 2);
            chai_1.assert.equal(count2, 2);
        });
        it('should manage multiple listener types', function () {
            var count1 = 0;
            var count2 = 0;
            var listener1 = function () { return count1++; };
            var listener2 = function () { return count2++; };
            eventEmitter.on('test', listener1);
            eventEmitter.on('foo', listener2);
            eventEmitter.emit('test');
            chai_1.assert.equal(count1, 1);
            chai_1.assert.equal(count2, 0);
            eventEmitter.emit('foo');
            chai_1.assert.equal(count1, 1);
            chai_1.assert.equal(count2, 1);
        });
    });
    describe('listeners', function () {
        it('should return listeners for the type requested', function () {
            chai_1.assert.equal(eventEmitter.listeners('test').length, 0);
            var listener = function () { };
            eventEmitter.on('test', listener);
            chai_1.assert.deepEqual(eventEmitter.listeners('test'), [listener]);
        });
    });
    describe('off', function () {
        it('should remove the specific listener', function () {
            var listener1 = function () { };
            var listener2 = function () { };
            eventEmitter.on('foo', listener1);
            eventEmitter.on('foo', listener2);
            chai_1.assert.equal(eventEmitter.listeners('foo').length, 2);
            eventEmitter.off('foo', listener1);
            chai_1.assert.deepEqual(eventEmitter.listeners('foo'), [listener2]);
        });
    });
    describe('removeAllListeners', function () {
        it('should clear all listeners', function () {
            eventEmitter.on('foo', function () { });
            chai_1.assert.equal(eventEmitter.listeners('foo').length, 1);
            eventEmitter.removeAllListeners('foo');
            chai_1.assert.equal(eventEmitter.listeners('foo').length, 0);
        });
    });
});

//# sourceMappingURL=EventEmitter.test.js.map
