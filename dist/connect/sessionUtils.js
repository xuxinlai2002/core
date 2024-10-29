"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNameSpacesByConnectResponse = buildNameSpacesByConnectResponse;
exports.buildRequestAccountNameSpacesByConnectResponse = buildRequestAccountNameSpacesByConnectResponse;
exports.buildTonNameSpaceByConnectResponse = buildTonNameSpaceByConnectResponse;
function buildNameSpacesByConnectResponse(connectResponse) {
    let requestAccountNameSpaces = buildRequestAccountNameSpacesByConnectResponse(connectResponse);
    // let tonNameSpaces = buildTonNameSpaceByConnectResponse(connectResponse);
    // const mergedNamespaces = Object.assign({}, requestAccountNameSpaces, tonNameSpaces);
    return requestAccountNameSpaces;
}
function buildRequestAccountNameSpacesByConnectResponse(connectResponse) {
    let result = {};
    console.log('buildRequestAccountNameSpacesByConnectResponse >>', JSON.stringify(connectResponse));
    const universalResponse = connectResponse.payload.responses.find(item => item.name === 'requestAccounts');
    universalResponse.accounts.forEach(item => {
        var chains = [];
        var accounts = [];
        item.addresses.forEach(addressItem => {
            var oneAddress = addressItem.split(":");
            if (oneAddress.length == 3) {
                chains.push(`${oneAddress[0]}:${oneAddress[1]}`);
                accounts.push(addressItem);
            }
        });
        result[item.namespace] = {
            chains: chains,
            accounts: accounts,
            methods: item.methods
        };
    });
    return result;
}
function buildTonNameSpaceByConnectResponse(connectResponse) {
    const tonAddrItem = connectResponse.payload.responses.find(item => item.name === 'ton_addr');
    const tonProfItem = connectResponse.payload.responses.find(item => item.name === 'ton_proof');
    if (!tonAddrItem) {
        return undefined;
    }
    return {
        NameSpaceKeyTON: {
            chains: [tonAddrItem.network],
            accounts: [],
            methods: connectResponse.payload.wallet.features.ton,
            payload: {
                tonAccount: {
                    address: tonAddrItem.address,
                    chain: tonAddrItem.network,
                    walletStateInit: tonAddrItem.walletStateInit,
                    publicKey: tonAddrItem.publicKey
                },
                tonProof: tonProfItem
            }
        }
    };
}
