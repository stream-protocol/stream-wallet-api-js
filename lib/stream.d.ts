import { Account } from 'stream-wallet-api-js/lib/account';
import { Connection } from 'stream-wallet-api-js/lib/connection';
import { Signer } from 'stream-wallet-api-js/lib/signer';
import { PublicKey } from 'stream-wallet-api-js/lib/utils/key_pair';
import { AccountCreator } from 'stream-wallet-api-js/lib/account_creator';
import { KeyStore } from 'stream-wallet-api-js/lib/key_stores';
export interface StreamConfig {
    /** Holds {@link utils/key_pair!KeyPair | KeyPairs} for signing transactions */
    keyStore?: KeyStore;
    /** @hidden */
    signer?: Signer;
    /**
     * [Stream Contract Helper](https://github.com/stream-protocol-protocol-protocol/stream-contract-helper) url used to create accounts if no master account is provided
     * @see {@link account_creator!UrlAccountCreator}
     */
    helperUrl?: string;
    /**
     * The balance transferred from the {@link masterAccount} to a created account
     * @see {@link account_creator!LocalAccountCreator}
     */
    initialBalance?: string;
    /**
     * The account to use when creating new accounts
     * @see {@link account_creator!LocalAccountCreator}
     */
    masterAccount?: string;
    /**
     * {@link utils/key_pair!KeyPair | KeyPairs} are stored in a {@link key_stores/keystore!KeyStore} under the `networkId` namespace.
     */
    networkId: string;
    /**
     * Stream RPC API url. used to make JSON RPC calls to interact with STREAM.
     * @see {@link providers/json-rpc-provider!JsonRpcProvider}
     */
    nodeUrl: string;
    /**
     * Stream RPC API headers. Can be used to pass API KEY and other parameters.
     * @see {@link providers/json-rpc-provider!JsonRpcProvider}
     */
    headers?: {
        [key: string]: string | number;
    };
    /**
     * Stream wallet url used to redirect users to their wallet in browser applications.
     * @see [https://wallet.streamprotocol.app/](https://wallet.streamprotocol.app/)
     */
    walletUrl?: string;
    /**
     * JVSM account ID for Stream JS SDK
     */
    jsvmAccountId?: string;
}
/**
 * This is the main class developers should use to interact with Stream.
 * @example
 * ```js
 * const stream = new Stream(config);
 * ```
 */
export declare class Stream {
    readonly config: any;
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;
    constructor(config: StreamConfig);
    /**
     * @param accountId stream accountId used to interact with the network.
     */
    account(accountId: string): Promise<Account>;
    /**
     * Create an account using the {@link account_creator!AccountCreator}. Either:
     * * using a masterAccount with {@link account_creator!LocalAccountCreator}
     * * using the helperUrl with {@link account_creator!UrlAccountCreator}
     * @see {@link StreamConfig.masterAccount} and {@link StreamConfig.helperUrl}
     *
     * @param accountId
     * @param publicKey
     */
    createAccount(accountId: string, publicKey: PublicKey): Promise<Account>;
}
