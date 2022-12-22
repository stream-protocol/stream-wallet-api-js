/**
 * The classes in this module are used in conjunction with the {@link key_stores/browser_local_storage_key_store!BrowserLocalStorageKeyStore}.
 * This module exposes two classes:
 * * {@link WalletConnection} which redirects users to [Stream Wallet](https://wallet.streamprotocol.app/) for key management.
 * * {@link ConnectedWalletAccount} is an {@link account!Account} implementation that uses {@link WalletConnection} to get keys
 *
 * @module walletAccount
 */
import { Account, SignAndSendTransactionOptions } from './account';
import { Stream } from 'stream-wallet-api-js/lib/stream';
import { KeyStore } from './key_stores';
import { FinalExecutionOutcome } from './providers';
import { Transaction, Action } from './transaction';
import { PublicKey } from './utils';
import { Connection } from './connection';
interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    successUrl?: string;
    failureUrl?: string;
}
/**
 * Information to send Stream wallet for signing transactions and redirecting the browser back to the calling application
 */
interface RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url STREAM Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information STREAM Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param */
    meta?: string;
}
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
export declare class WalletConnection {
    /** @hidden */
    _walletBaseUrl: string;
    /** @hidden */
    _authDataKey: string;
    /** @hidden */
    _keyStore: KeyStore;
    /** @hidden */
    _authData: {
        accountId?: string;
        allKeys?: string[];
    };
    /** @hidden */
    _networkId: string;
    /** @hidden */
    _stream: Stream;
    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;
    /** @hidden */
    _completeSignInPromise: Promise<void>;
    constructor(stream: Stream, appKeyPrefix: string | null);
    /**
     * Returns true, if this WalletConnection is authorized with the wallet.
     * @example
     * ```js
     * const wallet = new WalletConnection(stream, 'my-app');
     * wallet.isSignedIn();
     * ```
     */
    isSignedIn(): boolean;
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
    isSignedInAsync(): Promise<boolean>;
    /**
     * Returns authorized Account ID.
     * @example
     * ```js
     * const wallet = new WalletConnection(stream, 'my-app');
     * wallet.getAccountId();
     * ```
     */
    getAccountId(): string;
    /**
     * Redirects current page to the wallet authentication page.
     * @param options An optional options object
     * @param options.contractId The STREAM account where the contract is deployed
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
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void>;
    /**
     * Requests the user to quickly sign for a transaction or batch of transactions by redirecting to the Stream wallet.
     */
    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void>;
    /**
     * @hidden
     * Complete sign in for a given account id and public key. To be invoked by the app when getting a callback from the wallet.
     */
    _completeSignInWithAccessKey(): Promise<void>;
    /**
     * @hidden
     * @param accountId The Stream account owning the given public key
     * @param publicKey The public key being set to the key store
     */
    _moveKeyFromTempToPermanent(accountId: string, publicKey: string): Promise<void>;
    /**
     * Sign out from the current account
     * @example
     * walletConnection.signOut();
     */
    signOut(): void;
    /**
     * Returns the current connected wallet account
     */
    account(): ConnectedWalletAccount;
}
/**
 * {@link account!Account} implementation which redirects to wallet using {@link WalletConnection} when no local key is available.
 */
export declare class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;
    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string);
    /**
     * Sign a transaction by redirecting to the Stream Wallet
     * @see {@link WalletConnection.requestSignTransactions}
     */
    protected signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>;
    /**
     * Check if given access key allows the function call or method attempted in transaction
     * @param accessKey Array of \{access_key: AccessKey, public_key: PublicKey\} items
     * @param receiverId The STREAM account attempting to have access
     * @param actions The action(s) needed to be checked for access
     */
    accessKeyMatchesTransaction(accessKey: any, receiverId: string, actions: Action[]): Promise<boolean>;
    /**
     * Helper function returning the access key (if it exists) to the receiver that grants the designated permission
     * @param receiverId The Stream account seeking the access key for a transaction
     * @param actions The action(s) sought to gain access to
     * @param localKey A local public key provided to check for access
     */
    accessKeyForTransaction(receiverId: string, actions: Action[], localKey?: PublicKey): Promise<any>;
}
export {};
