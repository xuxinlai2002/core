"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUrlLastSlash = removeUrlLastSlash;
exports.addPathToUrl = addPathToUrl;
exports.getUniversalLink = getUniversalLink;
exports.openOKXDeeplinkWithFallback = openOKXDeeplinkWithFallback;
exports.getWindow = getWindow;
const constants_1 = require("../protocol/constants");
function removeUrlLastSlash(url) {
    if (url.slice(-1) === '/') {
        return url.slice(0, -1);
    }
    return url;
}
function addPathToUrl(url, path) {
    return removeUrlLastSlash(url) + '/' + path;
}
function getUniversalLink(deeplinkUrl) {
    const deeplinkEncodeUrl = encodeURIComponent(deeplinkUrl);
    return `${constants_1.standardUniversalLink}?deeplink=${deeplinkEncodeUrl}`;
}
function openOKXDeeplinkWithFallback(deeplinkUrl) {
    var _a;
    const fullUrl = getUniversalLink(deeplinkUrl);
    const isTelegram = !!((_a = getWindow()) === null || _a === void 0 ? void 0 : _a.TelegramWebviewProxy);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    console.log("openOKXDeeplinkWithFallback fullUrl:", fullUrl);
    let deepLinkOpened = false;
    const timeoutDuration = 1500; // 1.5秒的等待时间
    const startTime = Date.now();
    const downloadUrl = constants_1.standardUniversalLink;
    if (!isIOS) {
        let newWindow = null;
        var fallbackToDownloadPage = () => {
            if (!deepLinkOpened) {
                if (newWindow) {
                    newWindow.open(downloadUrl, '_self');
                }
                else {
                    window.open(downloadUrl, '_blank');
                }
            }
        };
        if (isTelegram) {
            newWindow = window.open(deeplinkUrl, '_blank');
        }
        else {
            window.location.href = deeplinkUrl;
        }
        setTimeout(fallbackToDownloadPage, timeoutDuration);
        window.addEventListener('blur', () => {
            deepLinkOpened = true;
        }, { once: true });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                deepLinkOpened = true;
            }
        });
    }
    else {
        if (isTelegram) {
            window.open(fullUrl, '_blank');
        }
        else {
            window.open(fullUrl, '_self');
        }
    }
}
function getWindow() {
    if (typeof window !== 'undefined') {
        return window;
    }
    return undefined;
}
