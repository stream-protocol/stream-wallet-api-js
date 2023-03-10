/**
 * @module
 * @description
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [STREAM RPC API](https://docs.streamprotocol.app/api/rpc/introduction).
 * @see {@link providers/provider | providers} for a list of request and response types
 */
import { AccessKeyWithPublicKey, Provider, FinalExecutionOutcome, NodeStatusResult, BlockId, BlockReference, BlockResult, BlockChangeResult, ChangeResult, ChunkId, ChunkResult, EpochValidatorInfo, StreamProtocolConfig, LightClientProof, LightClientProofRequest, GasPrice, QueryResponseKind } from './provider';
import { ConnectionInfo } from '../utils/web';
import { TypedError, ErrorContext } from '../utils/errors';
import { SignedTransaction } from '../transaction';
/** @hidden */
export { TypedError, ErrorContext };
/**
 * Client class to interact with the [STREAM RPC API](https://docs.streamprotocol.app/api/rpc/introduction).
 * @see [https://github.com/stream-protocol-protocol-protocol/stream-core/tree/master/chain/jsonrpc](https://github.com/stream-protocol-protocol-protocol/stream-core/tree/master/chain/jsonrpc)
 */
export declare class JsonRpcProvider extends Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;
    /**
     * @param connectionInfo Connection info
     */
    constructor(connectionInfo: ConnectionInfo);
    /**
     * Gets the RPC's status
     * @see [https://docs.streamprotocol.app/docs/develop/front-end/rpc#general-validator-status](https://docs.streamprotocol.app/docs/develop/front-end/rpc#general-validator-status)
     */
    status(): Promise<NodeStatusResult>;
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.streamprotocol.app/docs/develop/front-end/rpc#send-transaction-await](https://docs.streamprotocol.app/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    /**
     * Gets a transaction's status from the RPC
     * @see [https://docs.streamprotocol.app/docs/develop/front-end/rpc#transaction-status](https://docs.streamprotocol.app/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The STREAM account that signed the transaction
     */
    txStatus(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome>;
    private txStatusUint8Array;
    private txStatusString;
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The STREAM account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    txStatusReceipts(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome>;
    /**
     * Query the RPC by passing an {@link providers/provider!RpcQueryRequest}
     * @see [https://docs.streamprotocol.app/api/rpc/contracts](https://docs.streamprotocol.app/api/rpc/contracts)
     *
     * @typeParam T the shape of the returned query response
     */
    query<T extends QueryResponseKind>(...args: any[]): Promise<T>;
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.streamprotocol.app/api/rpc/block-chunk](https://docs.streamprotocol.app/api/rpc/block-chunk)
     *
     * @param blockQuery {@link providers/provider!BlockReference} (passing a {@link providers/provider!BlockId} is deprecated)
     */
    block(blockQuery: BlockId | BlockReference): Promise<BlockResult>;
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.streamprotocol.app/api/rpc/block-chunk](https://docs.streamprotocol.app/api/rpc/block-chunk)
     */
    blockChanges(blockQuery: BlockReference): Promise<BlockChangeResult>;
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see [https://docs.streamprotocol.app/api/rpc/block-chunk](https://docs.streamprotocol.app/api/rpc/block-chunk)
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    chunk(chunkId: ChunkId): Promise<ChunkResult>;
    /**
     * Query validators of the epoch defined by the given block id.
     * @see [https://docs.streamprotocol.app/api/rpc/network#validation-status](https://docs.streamprotocol.app/api/rpc/network#validation-status)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    experimental_protocolConfig(blockReference: BlockReference | {
        sync_checkpoint: 'genesis';
    }): Promise<StreamProtocolConfig>;
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/stream-protocol-protocol-protocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/stream-protocol-protocol-protocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    accountChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix?: string): Promise<ChangeResult>;
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.streamprotocol.app/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult>;
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see [https://docs.streamprotocol.app/api/rpc/gas](https://docs.streamprotocol.app/api/rpc/gas)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    gasPrice(blockId: BlockId | null): Promise<GasPrice>;
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc<T>(method: string, params: object): Promise<T>;
}
