export const __esModule: boolean;
/**
 * Function to call ton api until we get response.
 * Because ton network is pretty unstable we need to make sure response is final.
 * @param {T} fn - function to call
 * @param {CallForSuccessOptions} [options] - optional configuration options
 */
export function callForSuccess(fn: T, options?: any): any;
/**
 * Delays the execution of code for a specified number of milliseconds.
 * @param {number} timeout - The number of milliseconds to delay the execution.
 * @param {DelayOptions} [options] - Optional configuration options for the delay.
 * @return {Promise<void>} - A promise that resolves after the specified delay, or rejects if the delay is aborted.
 */
export function delay(timeout: number, options?: DelayOptions | undefined): Promise<void>;
