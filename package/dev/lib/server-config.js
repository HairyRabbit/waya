"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDebugger = require("debug");
const historyDebug = createDebugger('history-fallback');
function createServerConfig({ url, contents }) {
    return {
        port: parseInt(url.port),
        host: url.hostname,
        https: url.protocol.startsWith('https'),
        hot: true,
        historyApiFallback: {
            logger: historyDebug
        },
        publicPath: '/',
        contentBase: contents
    };
}
exports.createServerConfig = createServerConfig;
//# sourceMappingURL=server-config.js.map