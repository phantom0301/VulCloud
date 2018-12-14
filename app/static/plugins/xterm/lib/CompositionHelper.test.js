"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var CompositionHelper_1 = require("./CompositionHelper");
describe('CompositionHelper', function () {
    var terminal;
    var compositionHelper;
    var compositionView;
    var textarea;
    var handledText;
    beforeEach(function () {
        compositionView = {
            classList: {
                add: function () { },
                remove: function () { },
            },
            getBoundingClientRect: function () {
                return { width: 0 };
            },
            style: {
                left: 0,
                top: 0
            },
            textContent: ''
        };
        textarea = {
            value: '',
            style: {
                left: 0,
                top: 0
            }
        };
        terminal = {
            element: {
                querySelector: function () {
                    return { offsetLeft: 0, offsetTop: 0 };
                }
            },
            handler: function (text) {
                handledText += text;
            }
        };
        handledText = '';
        compositionHelper = new CompositionHelper_1.CompositionHelper(textarea, compositionView, terminal);
    });
    describe('Input', function () {
        it('Should insert simple characters', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'ㅇ' });
            textarea.value = 'ㅇ';
            setTimeout(function () {
                compositionHelper.compositionend();
                setTimeout(function () {
                    chai_1.assert.equal(handledText, 'ㅇ');
                    compositionHelper.compositionstart();
                    compositionHelper.compositionupdate({ data: 'ㅇ' });
                    textarea.value = 'ㅇㅇ';
                    setTimeout(function () {
                        compositionHelper.compositionend();
                        setTimeout(function () {
                            chai_1.assert.equal(handledText, 'ㅇㅇ');
                            done();
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert complex characters', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'ㅇ' });
            textarea.value = 'ㅇ';
            setTimeout(function () {
                compositionHelper.compositionupdate({ data: '아' });
                textarea.value = '아';
                setTimeout(function () {
                    compositionHelper.compositionupdate({ data: '앙' });
                    textarea.value = '앙';
                    setTimeout(function () {
                        compositionHelper.compositionend();
                        setTimeout(function () {
                            chai_1.assert.equal(handledText, '앙');
                            compositionHelper.compositionstart();
                            compositionHelper.compositionupdate({ data: 'ㅇ' });
                            textarea.value = '앙ㅇ';
                            setTimeout(function () {
                                compositionHelper.compositionupdate({ data: '아' });
                                textarea.value = '앙아';
                                setTimeout(function () {
                                    compositionHelper.compositionupdate({ data: '앙' });
                                    textarea.value = '앙앙';
                                    setTimeout(function () {
                                        compositionHelper.compositionend();
                                        setTimeout(function () {
                                            chai_1.assert.equal(handledText, '앙앙');
                                            done();
                                        }, 0);
                                    }, 0);
                                }, 0);
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert complex characters that change with following character', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'ㅇ' });
            textarea.value = 'ㅇ';
            setTimeout(function () {
                compositionHelper.compositionupdate({ data: '아' });
                textarea.value = '아';
                setTimeout(function () {
                    compositionHelper.compositionupdate({ data: '앙' });
                    textarea.value = '앙';
                    setTimeout(function () {
                        compositionHelper.compositionend();
                        compositionHelper.compositionstart();
                        compositionHelper.compositionupdate({ data: '아' });
                        textarea.value = '아아';
                        setTimeout(function () {
                            compositionHelper.compositionend();
                            setTimeout(function () {
                                chai_1.assert.equal(handledText, '아아');
                                done();
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert multi-characters compositions', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'd' });
            textarea.value = 'd';
            setTimeout(function () {
                compositionHelper.compositionupdate({ data: 'だ' });
                textarea.value = 'だ';
                setTimeout(function () {
                    compositionHelper.compositionupdate({ data: 'だあ' });
                    textarea.value = 'だあ';
                    setTimeout(function () {
                        compositionHelper.compositionend();
                        setTimeout(function () {
                            chai_1.assert.equal(handledText, 'だあ');
                            done();
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert multi-character compositions that are converted to other characters with the same length', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'd' });
            textarea.value = 'd';
            setTimeout(function () {
                compositionHelper.compositionupdate({ data: 'だ' });
                textarea.value = 'だ';
                setTimeout(function () {
                    compositionHelper.compositionupdate({ data: 'だー' });
                    textarea.value = 'だー';
                    setTimeout(function () {
                        compositionHelper.compositionupdate({ data: 'ダー' });
                        textarea.value = 'ダー';
                        setTimeout(function () {
                            compositionHelper.compositionend();
                            setTimeout(function () {
                                chai_1.assert.equal(handledText, 'ダー');
                                done();
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert multi-character compositions that are converted to other characters with different lengths', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'い' });
            textarea.value = 'い';
            setTimeout(function () {
                compositionHelper.compositionupdate({ data: 'いm' });
                textarea.value = 'いm';
                setTimeout(function () {
                    compositionHelper.compositionupdate({ data: 'いま' });
                    textarea.value = 'いま';
                    setTimeout(function () {
                        compositionHelper.compositionupdate({ data: '今' });
                        textarea.value = '今';
                        setTimeout(function () {
                            compositionHelper.compositionend();
                            setTimeout(function () {
                                chai_1.assert.equal(handledText, '今');
                                done();
                            }, 0);
                        }, 0);
                    }, 0);
                }, 0);
            }, 0);
        });
        it('Should insert non-composition characters input immediately after composition characters', function (done) {
            compositionHelper.compositionstart();
            compositionHelper.compositionupdate({ data: 'ㅇ' });
            textarea.value = 'ㅇ';
            setTimeout(function () {
                compositionHelper.compositionend();
                textarea.value = 'ㅇ1';
                setTimeout(function () {
                    chai_1.assert.equal(handledText, 'ㅇ1');
                    done();
                }, 0);
            }, 0);
        });
    });
});

//# sourceMappingURL=CompositionHelper.test.js.map
