import { KeyStore } from './keystore';
import { KeyPair } from '../utils/key_pair';
/**
 * Keystore which can be used to merge multiple key stores into one virtual key store.
 *
 * @example
 * ```js
 * const { homedir } = require('os');
 * import { connect, keyStores, utils } from 'stream-wallet-api-js';
 *
 * const privateKey = '.......';
 * const keyPair = utils.KeyPair.fromString(privateKey);
 *
 * const inMemoryKeyStore = new keyStores.InMemoryKeyStore();
 * inMemoryKeyStore.setKey('testnet', 'example-account.testnet', keyPair);
 *
 * const fileSystemKeyStore = new keyStores.UnencryptedFileSystemKeyStore(`${homedir()}/.stream-credentials`);
 *
 * const keyStore = new MergeKeyStore([
 *   inMemoryKeyStore,
 *   fileSystemKeyStore
 * ]);
 * const config = {
 *   keyStore, // instance of MergeKeyStore
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
interface MergeKeyStoreOptions {
    writeKeyStoreIndex: number;
}
export declare class MergeKeyStore extends KeyStore {
    private options;
    keyStores: KeyStore[];
    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores: KeyStore[], options?: MergeKeyStoreOptions);
    /**
     * Store a {@link utils/key_pair!KeyPair} to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link utils/key_pair!KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Removes a {@link utils/key_pair!KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Removes all items from each key store
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId: string): Promise<string[]>;
    /** @hidden */
    toString(): string;
}
export {};
