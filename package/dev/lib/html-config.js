"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HTMLEWebpackTemplate = require("html-webpack-template");
const DEFAULT_TITLE = 'Application';
function createHtmlConfig({ name: title = DEFAULT_TITLE, description, metas = [], lang, window, scripts, styles: links }) {
    const meta = metas.slice();
    if (description)
        meta.unshift({ content: description, name: 'description' });
    const options = {
        template: HTMLEWebpackTemplate,
        inject: false,
        mobile: true,
        title,
        meta,
        scripts,
        links,
        lang,
        window,
        bodyHtmlSnippet: '<div id="app">__SSR_PLACEHOLDER__</div>',
    };
    return {
        plugins: [
            new HTMLWebpackPlugin(options)
        ]
    };
}
exports.default = createHtmlConfig;
//# sourceMappingURL=html-config.js.map