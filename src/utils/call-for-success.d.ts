/**
 * Configuration options for the callForSuccess function.
 */
export type CallForSuccessOptions = {
    /**
     * The number of attempts to make before giving up. Default is 20.
     */
    attempts?: number;
    /**
     * The delay in milliseconds between each attempt. Default is 100ms.
     */
    delayMs?: number;
};
/**
 * Function to call ton api until we get response.
 * Because ton network is pretty unstable we need to make sure response is final.
 * @param {T} fn - function to call
 * @param {CallForSuccessOptions} [options] - optional configuration options
 */
export declare function callForSuccess<T extends () => Promise<any>>(fn: T, options?: CallForSuccessOptions): Promise<Awaited<ReturnType<T>>>;
export type DelayFnOptions = {
    /**
     * An 'AbortSignal' object that can be used to abort the delay.
     */
    signal?: AbortSignal;
};
/**
 * Delays the execution of code for a specified number of milliseconds.
 * @param {number} timeout - The number of milliseconds to delay the execution.
 * @param {DelayOptions} [options] - Optional configuration options for the delay.
 * @return {Promise<void>} - A promise that resolves after the specified delay, or rejects if the delay is aborted.
 */
export declare function delay(timeout: number, options?: DelayFnOptions): Promise<void>;
