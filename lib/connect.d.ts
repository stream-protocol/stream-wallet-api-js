import { Stream, StreamConfig } from './stream';
export interface ConnectConfig extends StreamConfig {
    /**
     * Initialize an {@link key_stores/in_memory_key_store!InMemoryKeyStore} by reading the file at keyPath.
     */
    keyPath?: string;
}
/**
 * Initialize connection to Stream network.
 */
export declare function connect(config: ConnectConfig): Promise<Stream>;
