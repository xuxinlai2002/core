export interface UserAgent {
    os: 'ios' | 'ipad' | 'android' | 'macos' | 'windows' | 'linux' | undefined;
    browser: 'chrome' | 'firefox' | 'safari' | 'opera' | undefined;
}
export declare function openLink(href: string, target?: string): void;
export declare function openLinkBlank(href: string): void;
export declare function openDeeplinkWithFallback(href: string, fallback: () => void): void;
export declare function isMobileUserAgent(): boolean;
export declare function getUserAgent(): UserAgent;
export declare function isOS(...os: UserAgent['os'][]): boolean;
export declare function isBrowser(...browser: UserAgent['browser'][]): boolean;
