import { KeyPair } from '../utils/key_pair';
import { KeyStore } from './keystore';
/** @hidden */
export declare function loadJsonFile(filename: string): Promise<any>;
/** @hidden */
export declare function readKeyFile(filename: string): Promise<[string, KeyPair]>;
/**
 * This class is used to store keys on the file system.
 *
 * @see [https://docs.streamprotocol.app/docs/develop/front-end/naj-quick-reference#key-store](https://docs.streamprotocol.app/docs/develop/front-end/naj-quick-reference#key-store)
 * @example
 * ```js
 * const { homedir } = require('os');
 * const { connect, keyStores } = require('stream-wallet-api-js');
 *
 * const keyStore = new keyStores.UnencryptedFileSystemKeyStore(`${homedir()}/.stream-credentials`);
 * const config = {
 *   keyStore, // instance of UnencryptedFileSystemKeyStore
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
export declare class UnencryptedFileSystemKeyStore extends KeyStore {
    /** @hidden */
    readonly keyDir: string;
    /**
     * @param keyDir base directory for key storage. Keys will be stored in `keyDir/networkId/accountId.json`
     */
    constructor(keyDir: string);
    /**
     * Store a {@link utils/key_pair!KeyPair} in an unencrypted file
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    /**
     * Gets a {@link utils/key_pair!KeyPair} from an unencrypted file
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string): Promise<KeyPair>;
    /**
     * Deletes an unencrypted file holding a {@link utils/key_pair!KeyPair}
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The STREAM account tied to the key pair
     */
    removeKey(networkId: string, accountId: string): Promise<void>;
    /**
     * Deletes all unencrypted files from the `keyDir` path.
     */
    clear(): Promise<void>;
    /** @hidden */
    private getKeyFilePath;
    /**
     * Get the network(s) from files in `keyDir`
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) files in `keyDir/networkId`
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId: string): Promise<string[]>;
    /** @hidden */
    toString(): string;
}
