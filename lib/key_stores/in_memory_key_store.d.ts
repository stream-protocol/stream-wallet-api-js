import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
/**
 * Simple in-memory keystore for mainly for testing purposes.
 *
 * @see [https://docs.streamprotocol.app/docs/develop/front-end/naj-quick-reference#key-store](https://docs.streamprotocol.app/docs/develop/front-end/naj-quick-reference#key-store)
 * @example
 * ```js
 * import { connect, keyStores, utils } from 'stream-wallet-api-js';
 *
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 *
 * const keyStore = new keyStores.InMemoryKeyStore();
 * keyStore.setKey('testnet', 'example-account.testnet', keyPair);
 *
 * const config = {
 *   keyStore, // instance of InMemoryKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.streamprotocol.app',
 *   walletUrl: 'https://wallet.testnet.streamprotocol.app',
 *   helperUrl: 'https://helper.testnet.streamprotocol.app',
 *   explorerUrl: 'https://explorer.testnet.streamprotocol.app'
 * };
 *
 * // inside an async function
 * const stream = await connect(config)
 * ```
 */
export declare class InMemoryKeyStore extends KeyStore {
    /** @hidden */
    private keys;
    constructor();
    /**
     * Stores a {@link utils/key_pair!KeyPair} in in-memory storage item
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link utils/key_pair!KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link utils/key_pair!KeyPair} from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Removes all {@link utils/key_pair!KeyPair} from in-memory storage
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from in-memory storage
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from in-memory storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId: string): Promise<string[]>;
    /** @hidden */
    toString(): string;
}
