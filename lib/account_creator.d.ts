import BN from 'bn.js';
import { Connection } from './connection';
import { Account } from './account';
import { PublicKey } from './utils/key_pair';
/**
 * Account creator provides an interface for implementations to actually create accounts
 */
export declare abstract class AccountCreator {
    abstract createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
export declare class LocalAccountCreator extends AccountCreator {
    readonly masterAccount: Account;
    readonly initialBalance: BN;
    constructor(masterAccount: Account, initialBalance: BN);
    /**
     * Creates an account using a masterAccount, meaning the new account is created from an existing account
     * @param newAccountId The name of the STREAM account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
    createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
export declare class UrlAccountCreator extends AccountCreator {
    readonly connection: Connection;
    readonly helperUrl: string;
    constructor(connection: Connection, helperUrl: string);
    /**
     * Creates an account using a helperUrl
     * This is [hosted here](https://helper.streamprotocol.com) or set up locally with the [stream-contract-helper](https://github.com/stream-protocol-protocol-protocol/stream-contract-helper) repository
     * @param newAccountId The name of the STREAM account to be created
     * @param publicKey The public key from the masterAccount used to create this account
     * @returns {Promise<void>}
     */
    createAccount(newAccountId: string, publicKey: PublicKey): Promise<void>;
}
