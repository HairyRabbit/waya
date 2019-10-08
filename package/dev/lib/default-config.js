"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const DEFAULT_EXTENSIONS = ['.js', '.json', '.mjs', '.ts', '.tsx'];
function createDefaultConfig({ context, name, libraryContext }) {
    return {
        mode: 'development',
        context,
        name: name + '-dev',
        devtool: 'inline-source-map',
        resolve: {
            extensions: DEFAULT_EXTENSIONS,
            alias: {
                '@': context
            },
            modules: [
                path.resolve(context, 'node_modules'),
                libraryContext
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
}
exports.default = createDefaultConfig;
//# sourceMappingURL=default-config.js.map