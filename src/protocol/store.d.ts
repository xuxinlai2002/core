import { ErrorResponse } from "./connect";
export declare abstract class IStore<Key, Value> {
    name: string;
    abstract map: Map<Key, Value>;
    abstract readonly context: string;
    abstract readonly length: number;
    abstract readonly keys: Key[];
    abstract readonly values: Value[];
    constructor(name: string, storagePrefix?: string);
    abstract init(): Promise<void>;
    abstract set(key: Key, value: Value): Promise<void>;
    abstract get(key: Key): Value;
    abstract getAll(filter?: Partial<Value>): Value[];
    abstract update(key: Key, update: Partial<Value>): Promise<void>;
    abstract delete(key: Key, reason: ErrorResponse): Promise<void>;
}
