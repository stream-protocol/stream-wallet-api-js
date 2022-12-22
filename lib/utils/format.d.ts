import BN from 'bn.js';
/**
 * Exponent for calculating how many indivisible units are there in one STREAM. See {@link STREAM_NOMINATION}.
 */
export declare const STREAM_NOMINATION_EXP = 24;
/**
 * Number of indivisible units in one STREAM. Derived from {@link STREAM_NOMINATION_EXP}.
 */
export declare const STREAM_NOMINATION: BN;
/**
 * Convert account balance value from internal indivisible units to STREAM. 1 STREAM is defined by {@link STREAM_NOMINATION}.
 * Effectively this divides given amount by {@link STREAM_NOMINATION}.
 *
 * @param balance decimal string representing balance in smallest non-divisible STREAM units (as specified by {@link STREAM_NOMINATION})
 * @param fracDigits number of fractional digits to preserve in formatted string. Balance is rounded to match given number of digits.
 * @returns Value in Ⓝ
 */
export declare function formatStreamAmount(balance: string, fracDigits?: number): string;
/**
 * Convert human readable STREAM amount to internal indivisible units.
 * Effectively this multiplies given amount by {@link STREAM_NOMINATION}.
 *
 * @param amt decimal string (potentially fractional) denominated in STREAM.
 * @returns The parsed yoctoⓃ amount or null if no amount was passed in
 */
export declare function parseStreamAmount(amt?: string): string | null;
