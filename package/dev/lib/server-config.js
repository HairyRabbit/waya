"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createServerConfig({ url }) {
    return {
        port: parseInt(url.port),
        host: url.host,
        hot: true,
        historyApiFallback: {
            verbose: true
        }
    };
}
exports.createServerConfig = createServerConfig;
//# sourceMappingURL=server-config.js.map