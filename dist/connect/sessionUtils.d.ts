export const __esModule: boolean;
export function buildNameSpacesByConnectResponse(connectResponse: any): {};
export function buildRequestAccountNameSpacesByConnectResponse(connectResponse: any): {};
export function buildTonNameSpaceByConnectResponse(connectResponse: any): {
    NameSpaceKeyTON: {
        chains: any[];
        accounts: never[];
        methods: any;
        payload: {
            tonAccount: {
                address: any;
                chain: any;
                walletStateInit: any;
                publicKey: any;
            };
            tonProof: any;
        };
    };
} | undefined;
