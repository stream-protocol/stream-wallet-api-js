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
exports.Contract = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const depd_1 = __importDefault(require("depd"));
const providers_1 = require("./providers");
const errors_1 = require("./utils/errors");
// Makes `function.name` return given name
function nameFunction(name, body) {
    return {
        [name](...args) {
            return body(...args);
        }
    }[name];
}
const isUint8Array = (x) => x && x.byteLength !== undefined && x.byteLength === x.length;
const isObject = (x) => Object.prototype.toString.call(x) === '[object Object]';
/**
 * Defines a smart contract on  including the change (mutable) and view (non-mutable) methods
 *
 * @see [https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#contract](https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#contract)
 * @example
 * ```js
 * import { Contract } from 'stream-wallet-api-js';
 *
 * async function contractExample() {
 *   const methodOptions = {
 *     viewMethods: ['getMessageByAccountId'],
 *     changeMethods: ['addMessage']
 *   };
 *   const contract = new Contract(
 *     wallet.account(),
 *     'contract-id.testnet',
 *     methodOptions
 *   );
 *
 *   // use a contract view method
 *   const messages = await contract.getMessages({
 *     accountId: 'example-account.testnet'
 *   });
 *
 *   // use a contract change method
 *   await contract.addMessage({
 *      meta: 'some info',
 *      callbackUrl: 'https://example.com/callback',
 *      args: { text: 'my message' },
 *      amount: 1
 *   })
 * }
 * ```
 */
class Contract {
    /**
     * @param account Stream account to sign change method transactions
     * @param contractId Stream account id where the contract is deployed
     * @param options Stream smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account, contractId, options) {
        this.account = account;
        this.contractId = contractId;
        const { viewMethods = [], changeMethods = [] } = options;
        viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, (args = {}, options = {}, ...ignored) => __awaiter(this, void 0, void 0, function*() {
                    if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                        throw new errors_1.PositionalArgsError();
                    }
                    return this.account.viewFunction(this.contractId, methodName, args, options);
                }))
            });
        });
        changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, (...args) => __awaiter(this, void 0, void 0, function*() {
                    if (args.length && (args.length > 3 || !(isObject(args[0]) || isUint8Array(args[0])))) {
                        throw new errors_1.PositionalArgsError();
                    }
                    if (args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = (0, depd_1.default)('contract.methodName(args, gas, amount)');
                        deprecate('use `contract.methodName({ args, gas?, amount?, callbackUrl?, meta? })` instead');
                        return this._changeMethod({
                            methodName,
                            args: args[0],
                            gas: args[1],
                            amount: args[2]
                        });
                    }
                    return this._changeMethod(Object.assign({ methodName }, args[0]));
                }))
            });
        });
    }
    _changeMethod({ args, methodName, gas, amount, meta, callbackUrl }) {
        return __awaiter(this, void 0, void 0, function*() {
            validateBNLike({ gas, amount });
            const rawResult = yield this.account.functionCall({
                contractId: this.contractId,
                methodName,
                args,
                gas,
                attachedDeposit: amount,
                walletMeta: meta,
                walletCallbackUrl: callbackUrl
            });
            return (0, providers_1.getTransactionLastResult)(rawResult);
        });
    }
}
exports.Contract = Contract;
/**
 * Validation on arguments being a big number from bn.js
 * Throws if an argument is not in BN format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap) {
    const bnLike = 'number, decimal string or BN';
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && !bn_js_1.default.isBN(argValue) && isNaN(argValue)) {
            throw new errors_1.ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}