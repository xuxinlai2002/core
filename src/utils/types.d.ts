export type WithoutId<T extends {
    requestId: unknown;
}> = Omit<T, 'requestId'>;
export type WithoutIdDistributive<T extends {
    requestId: unknown;
}> = DistributiveOmit<T, 'requestId'>;
export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
