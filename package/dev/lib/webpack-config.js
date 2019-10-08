"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpackMerge = require("webpack-merge");
const path = require("path");
const default_config_1 = require("./default-config");
const script_config_1 = require("./script-config");
const style_config_1 = require("./style-config");
const html_config_1 = require("./html-config");
const logo_config_1 = require("./logo-config");
const image_config_1 = require("./image-config");
const waya_core_1 = require("waya-core");
function createWebpackConfig({ context, project, library, entry, fallbacks, pkg, style: { globals, cssvar }, logo, url }) {
    const defaultConfig = default_config_1.default({ context, name: pkg.name, libraryContext: library.context });
    const scriptConfig = script_config_1.default({ context });
    const styleConfig = style_config_1.default({ context, globals, cssvar });
    const htmlConfig = html_config_1.default({ name: pkg.name, ...library.include });
    const logoConfig = logo_config_1.default({ context, logo });
    const imageConfig = image_config_1.default({});
    const prependEntries = [
        require.resolve('webpack-dev-server/client') + '?' + url.toString(),
        require.resolve('webpack/hot/dev-server')
    ];
    const commons = {
        entry: () => ([
            ...prependEntries,
            ...entry.style,
            ...entry.script
        ].filter((entry) => !!entry)),
        plugins: [
            ...fallbacks.map(({ fileName, options = {} }) => new waya_core_1.WebpackResolveFallbackPlugin(path.resolve(context, fileName), path.resolve(project, fileName), { contextAlias: '@', ...options }))
        ]
    };
    return webpackMerge(defaultConfig, scriptConfig, styleConfig, htmlConfig, logoConfig, imageConfig, commons);
}
exports.createWebpackConfig = createWebpackConfig;
//# sourceMappingURL=webpack-config.js.map