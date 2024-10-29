"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IEngine = exports.ISignClient = exports.ISignClientEvents = exports.IEngineEvents = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class IEngineEvents extends eventemitter3_1.default {
    constructor() {
        super();
    }
}
exports.IEngineEvents = IEngineEvents;
class ISignClientEvents extends eventemitter3_1.default {
    constructor() {
        super();
    }
}
exports.ISignClientEvents = ISignClientEvents;
class ISignClient {
    constructor(data) {
        this.data = data;
    }
}
exports.ISignClient = ISignClient;
class IEngine {
    constructor(client) {
        this.client = client;
    }
}
exports.IEngine = IEngine;
