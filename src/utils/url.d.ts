type TelegramWebviewProxy = {
    postEvent(eventType: string, eventData: string): void;
};
declare global {
    interface Window {
        TelegramWebviewProxy?: TelegramWebviewProxy;
    }
}
export declare function removeUrlLastSlash(url: string): string;
export declare function addPathToUrl(url: string, path: string): string;
export declare function getUniversalLink(deeplinkUrl: string): string;
export declare function openOKXDeeplinkWithFallback(deeplinkUrl: string): void;
export declare function getWindow(): Window | undefined;
export {};
