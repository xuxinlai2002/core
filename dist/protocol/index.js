"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonConnectSdkVersion = exports.standardDeeplink = exports.standardUniversalLink = exports.NameSpaceKeySui = exports.NameSpaceKeyTON = exports.NameSpaceKeySOL = exports.NameSpaceKeyEip155 = void 0;
__exportStar(require("./error"), exports);
var misc_1 = require("./misc");
Object.defineProperty(exports, "NameSpaceKeyEip155", { enumerable: true, get: function () { return misc_1.NameSpaceKeyEip155; } });
Object.defineProperty(exports, "NameSpaceKeySOL", { enumerable: true, get: function () { return misc_1.NameSpaceKeySOL; } });
Object.defineProperty(exports, "NameSpaceKeyTON", { enumerable: true, get: function () { return misc_1.NameSpaceKeyTON; } });
Object.defineProperty(exports, "NameSpaceKeySui", { enumerable: true, get: function () { return misc_1.NameSpaceKeySui; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "standardUniversalLink", { enumerable: true, get: function () { return constants_1.standardUniversalLink; } });
Object.defineProperty(exports, "standardDeeplink", { enumerable: true, get: function () { return constants_1.standardDeeplink; } });
Object.defineProperty(exports, "tonConnectSdkVersion", { enumerable: true, get: function () { return constants_1.tonConnectSdkVersion; } });
__exportStar(require("./connect"), exports);
