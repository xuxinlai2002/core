"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callForSuccess = callForSuccess;
exports.delay = delay;
/**
 * Function to call ton api until we get response.
 * Because ton network is pretty unstable we need to make sure response is final.
 * @param {T} fn - function to call
 * @param {CallForSuccessOptions} [options] - optional configuration options
 */
function callForSuccess(fn, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const attempts = (_a = options === null || options === void 0 ? void 0 : options.attempts) !== null && _a !== void 0 ? _a : 3;
        const delayMs = (_b = options === null || options === void 0 ? void 0 : options.delayMs) !== null && _b !== void 0 ? _b : 800;
        if (typeof fn !== 'function') {
            throw new Error(`Expected a function, got ${typeof fn}`);
        }
        let i = 0;
        let lastError;
        while (i < attempts) {
            try {
                return yield fn();
            }
            catch (err) {
                lastError = err;
                i++;
                if (i < attempts) {
                    yield delay(delayMs);
                }
            }
        }
        throw lastError;
    });
}
/**
 * Delays the execution of code for a specified number of milliseconds.
 * @param {number} timeout - The number of milliseconds to delay the execution.
 * @param {DelayOptions} [options] - Optional configuration options for the delay.
 * @return {Promise<void>} - A promise that resolves after the specified delay, or rejects if the delay is aborted.
 */
function delay(timeout, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var _a, _b;
            if ((_a = options === null || options === void 0 ? void 0 : options.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
                reject(new Error('Delay aborted'));
                return;
            }
            const timeoutId = setTimeout(() => resolve(), timeout);
            (_b = options === null || options === void 0 ? void 0 : options.signal) === null || _b === void 0 ? void 0 : _b.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                reject(new Error('Delay aborted'));
            });
        });
    });
}
