"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var INVALID_LINK_CLASS = 'xterm-invalid-link';
var protocolClause = '(https?:\\/\\/)';
var domainCharacterSet = '[\\da-z\\.-]+';
var negatedDomainCharacterSet = '[^\\da-z\\.-]+';
var domainBodyClause = '(' + domainCharacterSet + ')';
var tldClause = '([a-z\\.]{2,6})';
var ipClause = '((\\d{1,3}\\.){3}\\d{1,3})';
var localHostClause = '(localhost)';
var portClause = '(:\\d{1,5})';
var hostClause = '((' + domainBodyClause + '\\.' + tldClause + ')|' + ipClause + '|' + localHostClause + ')' + portClause + '?';
var pathClause = '(\\/[\\/\\w\\.\\-%~]*)*';
var queryStringHashFragmentCharacterSet = '[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&\'*+,:;~\\=\\.\\-]*';
var queryStringClause = '(\\?' + queryStringHashFragmentCharacterSet + ')?';
var hashFragmentClause = '(#' + queryStringHashFragmentCharacterSet + ')?';
var negatedPathCharacterSet = '[^\\/\\w\\.\\-%]+';
var bodyClause = hostClause + pathClause + queryStringClause + hashFragmentClause;
var start = '(?:^|' + negatedDomainCharacterSet + ')(';
var end = ')($|' + negatedPathCharacterSet + ')';
var strictUrlRegex = new RegExp(start + protocolClause + bodyClause + end);
var HYPERTEXT_LINK_MATCHER_ID = 0;
var Linkifier = (function () {
    function Linkifier() {
        this._nextLinkMatcherId = HYPERTEXT_LINK_MATCHER_ID;
        this._rowTimeoutIds = [];
        this._linkMatchers = [];
        this.registerLinkMatcher(strictUrlRegex, null, { matchIndex: 1 });
    }
    Linkifier.prototype.attachToDom = function (document, rows) {
        this._document = document;
        this._rows = rows;
    };
    Linkifier.prototype.linkifyRow = function (rowIndex) {
        if (!this._document) {
            return;
        }
        var timeoutId = this._rowTimeoutIds[rowIndex];
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        this._rowTimeoutIds[rowIndex] = setTimeout(this._linkifyRow.bind(this, rowIndex), Linkifier.TIME_BEFORE_LINKIFY);
    };
    Linkifier.prototype.setHypertextLinkHandler = function (handler) {
        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].handler = handler;
    };
    Linkifier.prototype.setHypertextValidationCallback = function (callback) {
        this._linkMatchers[HYPERTEXT_LINK_MATCHER_ID].validationCallback = callback;
    };
    Linkifier.prototype.registerLinkMatcher = function (regex, handler, options) {
        if (options === void 0) { options = {}; }
        if (this._nextLinkMatcherId !== HYPERTEXT_LINK_MATCHER_ID && !handler) {
            throw new Error('handler must be defined');
        }
        var matcher = {
            id: this._nextLinkMatcherId++,
            regex: regex,
            handler: handler,
            matchIndex: options.matchIndex,
            validationCallback: options.validationCallback,
            priority: options.priority || 0
        };
        this._addLinkMatcherToList(matcher);
        return matcher.id;
    };
    Linkifier.prototype._addLinkMatcherToList = function (matcher) {
        if (this._linkMatchers.length === 0) {
            this._linkMatchers.push(matcher);
            return;
        }
        for (var i = this._linkMatchers.length - 1; i >= 0; i--) {
            if (matcher.priority <= this._linkMatchers[i].priority) {
                this._linkMatchers.splice(i + 1, 0, matcher);
                return;
            }
        }
        this._linkMatchers.splice(0, 0, matcher);
    };
    Linkifier.prototype.deregisterLinkMatcher = function (matcherId) {
        for (var i = 1; i < this._linkMatchers.length; i++) {
            if (this._linkMatchers[i].id === matcherId) {
                this._linkMatchers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    Linkifier.prototype._linkifyRow = function (rowIndex) {
        var row = this._rows[rowIndex];
        if (!row) {
            return;
        }
        var text = row.textContent;
        for (var i = 0; i < this._linkMatchers.length; i++) {
            var matcher = this._linkMatchers[i];
            var linkElements = this._doLinkifyRow(row, matcher);
            if (linkElements.length > 0) {
                if (matcher.validationCallback) {
                    var _loop_1 = function (j) {
                        var element = linkElements[j];
                        matcher.validationCallback(element.textContent, element, function (isValid) {
                            if (!isValid) {
                                element.classList.add(INVALID_LINK_CLASS);
                            }
                        });
                    };
                    for (var j = 0; j < linkElements.length; j++) {
                        _loop_1(j);
                    }
                }
                return;
            }
        }
    };
    Linkifier.prototype._doLinkifyRow = function (row, matcher) {
        var result = [];
        var isHttpLinkMatcher = matcher.id === HYPERTEXT_LINK_MATCHER_ID;
        var nodes = row.childNodes;
        var match = row.textContent.match(matcher.regex);
        if (!match || match.length === 0) {
            return result;
        }
        var uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
        var rowStartIndex = match.index + uri.length;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var searchIndex = node.textContent.indexOf(uri);
            if (searchIndex >= 0) {
                var linkElement = this._createAnchorElement(uri, matcher.handler, isHttpLinkMatcher);
                if (node.textContent.length === uri.length) {
                    if (node.nodeType === 3) {
                        this._replaceNode(node, linkElement);
                    }
                    else {
                        var element = node;
                        if (element.nodeName === 'A') {
                            return result;
                        }
                        element.innerHTML = '';
                        element.appendChild(linkElement);
                    }
                }
                else if (node.childNodes.length > 1) {
                    for (var j = 0; j < node.childNodes.length; j++) {
                        var childNode = node.childNodes[j];
                        var childSearchIndex = childNode.textContent.indexOf(uri);
                        if (childSearchIndex !== -1) {
                            this._replaceNodeSubstringWithNode(childNode, linkElement, uri, childSearchIndex);
                            break;
                        }
                    }
                }
                else {
                    var nodesAdded = this._replaceNodeSubstringWithNode(node, linkElement, uri, searchIndex);
                    i += nodesAdded;
                }
                result.push(linkElement);
                match = row.textContent.substring(rowStartIndex).match(matcher.regex);
                if (!match || match.length === 0) {
                    return result;
                }
                uri = match[typeof matcher.matchIndex !== 'number' ? 0 : matcher.matchIndex];
                rowStartIndex += match.index + uri.length;
            }
        }
        return result;
    };
    Linkifier.prototype._createAnchorElement = function (uri, handler, isHypertextLinkHandler) {
        var element = this._document.createElement('a');
        element.textContent = uri;
        element.draggable = false;
        if (isHypertextLinkHandler) {
            element.href = uri;
            element.target = '_blank';
            element.addEventListener('click', function (event) {
                if (handler) {
                    return handler(event, uri);
                }
            });
        }
        else {
            element.addEventListener('click', function (event) {
                if (element.classList.contains(INVALID_LINK_CLASS)) {
                    return;
                }
                return handler(event, uri);
            });
        }
        return element;
    };
    Linkifier.prototype._replaceNode = function (oldNode) {
        var newNodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            newNodes[_i - 1] = arguments[_i];
        }
        var parent = oldNode.parentNode;
        for (var i = 0; i < newNodes.length; i++) {
            parent.insertBefore(newNodes[i], oldNode);
        }
        parent.removeChild(oldNode);
    };
    Linkifier.prototype._replaceNodeSubstringWithNode = function (targetNode, newNode, substring, substringIndex) {
        if (targetNode.childNodes.length === 1) {
            targetNode = targetNode.childNodes[0];
        }
        if (targetNode.nodeType !== 3) {
            throw new Error('targetNode must be a text node or only contain a single text node');
        }
        var fullText = targetNode.textContent;
        if (substringIndex === 0) {
            var rightText_1 = fullText.substring(substring.length);
            var rightTextNode_1 = this._document.createTextNode(rightText_1);
            this._replaceNode(targetNode, newNode, rightTextNode_1);
            return 0;
        }
        if (substringIndex === targetNode.textContent.length - substring.length) {
            var leftText_1 = fullText.substring(0, substringIndex);
            var leftTextNode_1 = this._document.createTextNode(leftText_1);
            this._replaceNode(targetNode, leftTextNode_1, newNode);
            return 0;
        }
        var leftText = fullText.substring(0, substringIndex);
        var leftTextNode = this._document.createTextNode(leftText);
        var rightText = fullText.substring(substringIndex + substring.length);
        var rightTextNode = this._document.createTextNode(rightText);
        this._replaceNode(targetNode, leftTextNode, newNode, rightTextNode);
        return 1;
    };
    return Linkifier;
}());
Linkifier.TIME_BEFORE_LINKIFY = 200;
exports.Linkifier = Linkifier;

//# sourceMappingURL=Linkifier.js.map
