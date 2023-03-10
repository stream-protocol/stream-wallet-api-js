import { KeyPair } from '../utils/key_pair';
/**
 * KeyStores are passed to {@link stream!Stream} via {@link stream!StreamConfig}
 * and are used by the {@link signer!InMemorySigner} to sign transactions.
 *
 * @see {@link connect}
 */
export declare abstract class KeyStore {
    abstract setKey(networkId: string, accountId: string, keyPair: KeyPair): Promise<void>;
    abstract getKey(networkId: string, accountId: string): Promise<KeyPair>;
    abstract removeKey(networkId: string, accountId: string): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<string[]>;
    abstract getAccounts(networkId: string): Promise<string[]>;
}
