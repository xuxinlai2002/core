"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = logDebug;
exports.logError = logError;
exports.logWarning = logWarning;
const debug = false;
function logDebug(...args) {
    if (typeof console != 'undefined') {
        try {
            if (debug || (window === null || window === void 0 ? void 0 : window.okxLogDebug)) {
                console.debug('[OKX_CONNECT_SDK]', ...args);
            }
        }
        catch (_a) { }
    }
}
function logError(...args) {
    if (typeof console != 'undefined') {
        try {
            if (debug || (window === null || window === void 0 ? void 0 : window.okxLogDebug)) {
                console.error('[OKX_CONNECT_SDK]', ...args);
            }
        }
        catch (_a) { }
    }
}
function logWarning(...args) {
    if (typeof console != 'undefined') {
        try {
            if (debug || (window === null || window === void 0 ? void 0 : window.okxLogDebug)) {
                console.warn('[OKX_CONNECT_SDK]', ...args);
            }
        }
        catch (_a) { }
    }
}
