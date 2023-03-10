"use strict";
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function(resolve) { resolve(value); }); }
    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }

        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
/**
 * Connect to Stream using the provided configuration.
 *
 * {@link ConnectConfig.networkId} and {@link ConnectConfig.nodeUrl} are required.
 *
 * To sign transactions you can also pass: {@link ConnectConfig.keyStore}
 *
 * Both are passed they are prioritize in that order.
 *
 * @see {@link ConnectConfig}
 * @example
 * ```js
 * async function initStream() {
 *   const stream = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.streamprotocol.app'
 *   })
 * }
 * ```
 *
 * @module browserConnect
 */
const stream_1 = require("./stream");
/**
 * Initialize connection to Stream network.
 */
function connect(config) {
    return __awaiter(this, void 0, void 0, function*() {
        return new stream_1.Stream(config);
    });
}
exports.connect = connect;