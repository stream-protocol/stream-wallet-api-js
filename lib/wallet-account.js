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
exports.ConnectedWalletAccount = exports.WalletConnection = void 0;
/**
 * The classes in this module are used in conjunction with the {@link key_stores/browser_local_storage_key_store!BrowserLocalStorageKeyStore}.
 * This module exposes two classes:
 * * {@link WalletConnection} which redirects users to [Stream Wallet](https://wallet.streamprotocol.app/) for key management.
 * * {@link ConnectedWalletAccount} is an {@link account!Account} implementation that uses {@link WalletConnection} to get keys
 *
 * @module walletAccount
 */
const account_1 = require("./account");
const transaction_1 = require("./transaction");
const utils_1 = require("./utils");
const borsh_1 = require("borsh");
const borsh_2 = require("borsh");
const bn_js_1 = __importDefault(require("bn.js"));
const LOGIN_WALLET_URL_SUFFIX = '/login/';
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';
const LOCAL_STORAGE_KEY_SUFFIX = '_wallet_auth_key';
const PENDING_ACCESS_KEY_PREFIX = 'pending_key'; // browser storage key for a pending access key (i.e. key has been generated but we are not sure it was added yet)
/**
 * This class is used in conjunction with the {@link key_stores/browser_local_storage_key_store!BrowserLocalStorageKeyStore}.
 * It redirects users to [Stream Wallet](https://wallet.streamprotocol.app) for key management.
 * This class is not intended for use outside the browser. Without `window` (i.e. in server contexts), it will instantiate but will throw a clear error when used.
 *
 * @see [https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#wallet](https://docs.streamprotocol.app/tools/stream-wallet-api-js/quick-reference#wallet)
 * @example
 * ```js
 * // create new WalletConnection instance
 * const wallet = new WalletConnection(stream, 'my-app');
 *
 * // If not signed in redirect to the Stream wallet to sign in
 * // keys will be stored in the BrowserLocalStorageKeyStore
 * if(!wallet.isSignedIn()) return wallet.requestSignIn()
 * ```
 */
class WalletConnection {
    constructor(stream, appKeyPrefix) {
            if (typeof window === 'undefined') {
                return new Proxy(this, {
                    get(target, property) {
                        if (property === 'isSignedIn') {
                            return () => false;
                        }
                        if (property === 'getAccountId') {
                            return () => '';
                        }
                        if (target[property] && typeof target[property] === 'function') {
                            return () => {
                                throw new Error('No window found in context, please ensure you are using WalletConnection on the browser');
                            };
                        }
                        return target[property];
                    }
                });
            }
            this._stream = stream;
            const authDataKey = appKeyPrefix + LOCAL_STORAGE_KEY_SUFFIX;
            const authData = JSON.parse(window.localStorage.getItem(authDataKey));
            this._networkId = stream.config.networkId;
            this._walletBaseUrl = stream.config.walletUrl;
            appKeyPrefix = appKeyPrefix || stream.config.contractName || 'default';
            this._keyStore = stream.connection.signer.keyStore;
            this._authData = authData || { allKeys: [] };
            this._authDataKey = authDataKey;
            if (!this.isSignedIn()) {
                this._completeSignInPromise = this._completeSignInWithAccessKey();
            }
        }
        /**
         * Returns true, if this WalletConnection is authorized with the wallet.
         * @example
         * ```js
         * const wallet = new WalletConnection(stream, 'my-app');
         * wallet.isSignedIn();
         * ```
         */
    isSignedIn() {
            return !!this._authData.accountId;
        }
        /**
         * Returns promise of completing signing in after redirecting from wallet
         * @example
         * ```js
         * // on login callback page
         * const wallet = new WalletConnection(stream, 'my-app');
         * wallet.isSignedIn(); // false
         * await wallet.isSignedInAsync(); // true
         * ```
         */
    isSignedInAsync() {
            return __awaiter(this, void 0, void 0, function*() {
                if (!this._completeSignInPromise) {
                    return this.isSignedIn();
                }
                yield this._completeSignInPromise;
                return this.isSignedIn();
            });
        }
        /**
         * Returns authorized Account ID.
         * @example
         * ```js
         * const wallet = new WalletConnection(stream, 'my-app');
         * wallet.getAccountId();
         * ```
         */
    getAccountId() {
            return this._authData.accountId || '';
        }
        /**
         * Redirects current page to the wallet authentication page.
         * @param options An optional options object
         * @param options.contractId The Stream account where the contract is deployed
         * @param options.successUrl URL to redirect upon success. Default: current url
         * @param options.failureUrl URL to redirect upon failure. Default: current url
         *
         * @example
         * ```js
         * const wallet = new WalletConnection(stream, 'my-app');
         * // redirects to the Stream Wallet
         * wallet.requestSignIn({ contractId: 'account-with-deploy-contract.stream' });
         * ```
         */
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }) {
            return __awaiter(this, void 0, void 0, function*() {
                const currentUrl = new URL(window.location.href);
                const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
                newUrl.searchParams.set('success_url', successUrl || currentUrl.href);
                newUrl.searchParams.set('failure_url', failureUrl || currentUrl.href);
                if (contractId) {
                    /* Throws exception if contract account does not exist */
                    const contractAccount = yield this._stream.account(contractId);
                    yield contractAccount.state();
                    newUrl.searchParams.set('contract_id', contractId);
                    const accessKey = utils_1.KeyPair.fromRandom('ed25519');
                    newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
                    yield this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
                }
                if (methodNames) {
                    methodNames.forEach(methodName => {
                        newUrl.searchParams.append('methodNames', methodName);
                    });
                }
                window.location.assign(newUrl.toString());
            });
        }
        /**
         * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the Stream wallet.
         */
    requestSignTransactions({ transactions, meta, callbackUrl }) {
            return __awaiter(this, void 0, void 0, function*() {
                const currentUrl = new URL(window.location.href);
                const newUrl = new URL('sign', this._walletBaseUrl);
                newUrl.searchParams.set('transactions', transactions
                    .map(transaction => (0, borsh_2.serialize)(transaction_1.SCHEMA, transaction))
                    .map(serialized => Buffer.from(serialized).toString('base64'))
                    .join(','));
                newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
                if (meta)
                    newUrl.searchParams.set('meta', meta);
                window.location.assign(newUrl.toString());
            });
        }
        /**
         * @hidden
         * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
         */
    _completeSignInWithAccessKey() {
            return __awaiter(this, void 0, void 0, function*() {
                const currentUrl = new URL(window.location.href);
                const publicKey = currentUrl.searchParams.get('public_key') || '';
                const allKeys = (currentUrl.searchParams.get('all_keys') || '').split(',');
                const accountId = currentUrl.searchParams.get('account_id') || '';
                // TODO: Handle errors during login
                if (accountId) {
                    const authData = {
                        accountId,
                        allKeys
                    };
                    window.localStorage.setItem(this._authDataKey, JSON.stringify(authData));
                    if (publicKey) {
                        yield this._moveKeyFromTempToPermanent(accountId, publicKey);
                    }
                    this._authData = authData;
                }
                currentUrl.searchParams.delete('public_key');
                currentUrl.searchParams.delete('all_keys');
                currentUrl.searchParams.delete('account_id');
                currentUrl.searchParams.delete('meta');
                currentUrl.searchParams.delete('transactionHashes');
                window.history.replaceState({}, document.title, currentUrl.toString());
            });
        }
        /**
         * @hidden
         * @param accountId The Stream account owning the given public key
         * @param publicKey The public key being set to the key store
         */
    _moveKeyFromTempToPermanent(accountId, publicKey) {
            return __awaiter(this, void 0, void 0, function*() {
                const keyPair = yield this._keyStore.getKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
                yield this._keyStore.setKey(this._networkId, accountId, keyPair);
                yield this._keyStore.removeKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + publicKey);
            });
        }
        /**
         * Sign out from the current account
         * @example
         * walletConnection.signOut();
         */
    signOut() {
            this._authData = {};
            window.localStorage.removeItem(this._authDataKey);
        }
        /**
         * Returns the current connected wallet account
         */
    account() {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccount(this, this._stream.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}
exports.WalletConnection = WalletConnection;
/**
 * {@link account!Account} implementation which redirects to wallet using {@link WalletConnection} when no local key is available.
 */
class ConnectedWalletAccount extends account_1.Account {
    constructor(walletConnection, connection, accountId) {
            super(connection, accountId);
            this.walletConnection = walletConnection;
        }
        // Overriding Account methods
        /**
         * Sign a transaction by redirecting to the Stream Wallet
         * @see {@link WalletConnection.requestSignTransactions}
         */
    signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl = window.location.href }) {
            const _super = Object.create(null, {
                signAndSendTransaction: { get: () => super.signAndSendTransaction }
            });
            return __awaiter(this, void 0, void 0, function*() {
                const localKey = yield this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
                let accessKey = yield this.accessKeyForTransaction(receiverId, actions, localKey);
                if (!accessKey) {
                    throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`);
                }
                if (localKey && localKey.toString() === accessKey.public_key) {
                    try {
                        return yield _super.signAndSendTransaction.call(this, { receiverId, actions });
                    } catch (e) {
                        if (e.type === 'NotEnoughAllowance') {
                            accessKey = yield this.accessKeyForTransaction(receiverId, actions);
                        } else {
                            throw e;
                        }
                    }
                }
                const block = yield this.connection.provider.block({ finality: 'final' });
                const blockHash = (0, borsh_1.baseDecode)(block.header.hash);
                const publicKey = utils_1.PublicKey.from(accessKey.public_key);
                // TODO: Cache & listen for nonce updates for given access key
                const nonce = accessKey.access_key.nonce.add(new bn_js_1.default(1));
                const transaction = (0, transaction_1.createTransaction)(this.accountId, publicKey, receiverId, nonce, actions, blockHash);
                yield this.walletConnection.requestSignTransactions({
                    transactions: [transaction],
                    meta: walletMeta,
                    callbackUrl: walletCallbackUrl
                });
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('Failed to redirect to sign transaction'));
                    }, 1000);
                });
                // TODO: Aggregate multiple transaction request with "debounce".
                // TODO: Introduce TrasactionQueue which also can be used to watch for status?
            });
        }
        /**
         * Check if given access key allows the function call or method attempted in transaction
         * @param accessKey Array of \{access_key: AccessKey, public_key: PublicKey\} items
         * @param receiverId The Stream account attempting to have access
         * @param actions The action(s) needed to be checked for access
         */
    accessKeyMatchesTransaction(accessKey, receiverId, actions) {
            return __awaiter(this, void 0, void 0, function*() {
                const { access_key: { permission } } = accessKey;
                if (permission === 'FullAccess') {
                    return true;
                }
                if (permission.FunctionCall) {
                    const { receiver_id: allowedReceiverId, method_names: allowedMethods } = permission.FunctionCall;
                    /********************************
                    Accept multisig access keys and let wallets attempt to signAndSendTransaction
                    If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/stream-protocol-protocol-protocol/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
                    ********************************/
                    if (allowedReceiverId === this.accountId && allowedMethods.includes(MULTISIG_HAS_METHOD)) {
                        return true;
                    }
                    if (allowedReceiverId === receiverId) {
                        if (actions.length !== 1) {
                            return false;
                        }
                        const [{ functionCall }] = actions;
                        return functionCall &&
                            (!functionCall.deposit || functionCall.deposit.toString() === '0') && // TODO: Should support charging amount smaller than allowance?
                            (allowedMethods.length === 0 || allowedMethods.includes(functionCall.methodName));
                        // TODO: Handle cases when allowance doesn't have enough to pay for gas
                    }
                }
                // TODO: Support other permissions than FunctionCall
                return false;
            });
        }
        /**
         * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
         * @param receiverId The Stream account seeking the access key for a transaction
         * @param actions The action(s) sought to gain access to
         * @param localKey A local public key provided to check for access
         */
    accessKeyForTransaction(receiverId, actions, localKey) {
        return __awaiter(this, void 0, void 0, function*() {
            const accessKeys = yield this.getAccessKeys();
            if (localKey) {
                const accessKey = accessKeys.find(key => key.public_key.toString() === localKey.toString());
                if (accessKey && (yield this.accessKeyMatchesTransaction(accessKey, receiverId, actions))) {
                    return accessKey;
                }
            }
            const walletKeys = this.walletConnection._authData.allKeys;
            for (const accessKey of accessKeys) {
                if (walletKeys.indexOf(accessKey.public_key) !== -1 && (yield this.accessKeyMatchesTransaction(accessKey, receiverId, actions))) {
                    return accessKey;
                }
            }
            return null;
        });
    }
}
exports.ConnectedWalletAccount = ConnectedWalletAccount;