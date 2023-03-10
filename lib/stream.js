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
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stream = void 0;
/**
 * This module contains the main class developers will use to interact with Stream Protocol.
 * The {@link Stream} class is used to interact with {@link account!Account | Accounts} through the {@link providers/json-rpc-provider!JsonRpcProvider}.
 * It is configured via the {@link StreamConfig}.
 *
 * @see [https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#account](https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#account)
 *
 * @module stream
 */
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("stream-wallet-api-js/lib/account");
const connection_1 = require("stream-wallet-api-js/lib/connection");
const account_creator_1 = require("stream-wallet-api-js/lib/account_creator");
/**
 * This is the main class developers should use to interact with Stream Protocol.
 * @example
 * ```js
 * const stream = new Stream(config);
 * ```
 */
class Stream {
    constructor(config) {
            this.config = config;
            this.connection = connection_1.Connection.fromConfig({
                networkId: config.networkId,
                provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl, headers: config.headers } },
                signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore },
                jsvmAccountId: config.jsvmAccountId || `jsvm.${config.networkId}`
            });
            if (config.masterAccount) {
                // TODO: figure out better way of specifiying initial balance.
                // Hardcoded number below must be enough to pay the gas cost to dev-deploy with stream-shell for multiple times
                const initialBalance = config.initialBalance ? new bn_js_1.default(config.initialBalance) : new bn_js_1.default('500000000000000000000000000');
                this.accountCreator = new account_creator_1.LocalAccountCreator(new account_1.Account(this.connection, config.masterAccount), initialBalance);
            } else if (config.helperUrl) {
                this.accountCreator = new account_creator_1.UrlAccountCreator(this.connection, config.helperUrl);
            } else {
                this.accountCreator = null;
            }
        }
        /**
         * @param accountId stream accountId used to interact with the network.
         */
    account(accountId) {
            return __awaiter(this, void 0, void 0, function*() {
                const account = new account_1.Account(this.connection, accountId);
                return account;
            });
        }
        /**
         * Create an account using the {@link account_creator!AccountCreator}. Either:
         * * using a masterAccount with {@link account_creator!LocalAccountCreator}
         * * using the helperUrl with {@link account_creator!UrlAccountCreator}
         * @see {@link StreamConfig.masterAccount} and {@link StreamConfig.helperUrl}
         *
         * @param accountId
         * @param publicKey
         */
    createAccount(accountId, publicKey) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!this.accountCreator) {
                throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
            }
            yield this.accountCreator.createAccount(accountId, publicKey);
            return new account_1.Account(this.connection, accountId);
        });
    }
}
exports.Stream = Stream;