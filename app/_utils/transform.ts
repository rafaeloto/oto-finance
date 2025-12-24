/* eslint-disable @typescript-eslint/no-explicit-any */
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Recursively converts all Decimal instances in an object, array, or primitive value to JavaScript numbers.
 * This is particularly useful when working with Prisma Decimal fields that need to be serialized
 * for client-side usage, as Decimal objects are not directly serializable.
 *
 * @template T - The type of the input data
 * @param {T} data - The data to process, which can be a primitive, array, or object containing Decimal values
 * @returns {T} A new object/array/primitive with all Decimal instances converted to numbers
 *
 * @example
 * // Single Decimal value
 * const result = parseDecimals(new Decimal('123.45')); // returns 123.45
 *
 * @example
 * // Object with Decimal values
 * const account = {
 *   id: '1',
 *   balance: new Decimal('1000.50'),
 *   transactions: [
 *     { amount: new Decimal('100.25') },
 *     { amount: new Decimal('200.75') }
 *   ]
 * };
 * const parsed = parseDecimals(account);
 * // Returns: { id: '1', balance: 1000.5, transactions: [{ amount: 100.25 }, { amount: 200.75 }] }
 */
export function parseDecimals<T>(data: T): T {
  // Handle null and undefined values returning them as-is
  if (data === null || data === undefined) return data;

  // Preserve Date objects by returning them as-is
  if (data instanceof Date) {
    return data;
  }

  // Convert Decimal instances to numbers
  if (data instanceof Decimal) {
    return Number(data) as unknown as T;
  }

  // Recursively process arrays
  if (Array.isArray(data)) {
    return data.map(parseDecimals) as unknown as T;
  }

  // Recursively process objects
  if (typeof data === "object") {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = parseDecimals((data as any)[key]);
      }
    }
    return result as T;
  }

  return data;
}
