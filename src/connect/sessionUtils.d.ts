import { SessionTypes } from "../protocol/connect/session";
import { ConnectResponseSuccess } from "../protocol/connect/connect-response";
import Namespaces = SessionTypes.Namespaces;
export declare function buildNameSpacesByConnectResponse(connectResponse: ConnectResponseSuccess): Namespaces | undefined;
export declare function buildRequestAccountNameSpacesByConnectResponse(connectResponse: ConnectResponseSuccess): Namespaces | undefined;
export declare function buildTonNameSpaceByConnectResponse(connectResponse: ConnectResponseSuccess): Namespaces | undefined;
