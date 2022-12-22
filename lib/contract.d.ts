import { Account } from './account';
export interface ContractMethods {
    /**
     * Methods that change state. These methods cost gas and require a signed transaction.
     *
     * @see {@link account!Account.functionCall}
     */
    changeMethods: string[];
    /**
     * View methods do not require a signed transaction.
     *
     * @see {@link account!Account#viewFunction}
     */
    viewMethods: string[];
}
/**
 * Defines a smart contract on Stream Wallet including the change (mutable) and view (non-mutable) methods
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
export declare class Contract {
    readonly account: Account;
    readonly contractId: string;
    /**
     * @param account Stream account to sign change method transactions
     * @param contractId Stream account id where the contract is deployed
     * @param options Stream smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account: Account, contractId: string, options: ContractMethods);
    private _changeMethod;
}
