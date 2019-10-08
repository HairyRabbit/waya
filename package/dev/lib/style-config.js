"use strict";
///<reference path="../types/postcss-scss.d.ts" />
///<reference path="../types/postcss-preset-env.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const postcssSyntaxScss = require("postcss-scss");
const postcssPresetEnv = require("postcss-preset-env");
const waya_core_1 = require("waya-core");
const loaderUtils = require("loader-utils");
function makeRootCssVariableRules() {
    const globalUses = createGlobalStyleUses();
    globalUses.push({
        loader: require.resolve('./root-cssvar-loader')
    });
    return globalUses;
}
function createGlobalStyleUses() {
    const rules = [];
    rules.push(waya_core_1.createLoaderUse("postcss" /* Postcss */, {
        sourceMap: true,
        syntax: postcssSyntaxScss,
        plugins: [
            postcssPresetEnv()
        ]
    }));
    rules.push(waya_core_1.createLoaderUse("sass" /* Sass */, {
        // webpackImporter: false,
        sourceMap: true
    }));
    rules.push(waya_core_1.createLoaderUse("css" /* Css */, {
        sourceMap: true,
        importLoaders: rules.length
    }));
    rules.push(waya_core_1.createLoaderUse("style" /* Style */));
    return rules.reverse().slice();
}
function createModuleStyleUses() {
    const rules = [];
    rules.push(waya_core_1.createLoaderUse("sass" /* Sass */, {
        sourceMap: true
    }));
    rules.push(waya_core_1.createLoaderUse("css" /* Css */, {
        importLoaders: rules.length,
        modules: {
            localIdentName: '[path][local]-[hash:base64:5]',
            getLocalIdent: overrideLibraryClassName
        },
        sourceMap: true
    }));
    rules.push(waya_core_1.createLoaderUse("style" /* Style */));
    return rules.reverse().slice();
}
function overrideLibraryClassName(loaderContext, localIdentName, localName, options) {
    if (!options.context) {
        options.context = loaderContext.rootContext || '.';
    }
    const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/');
    options.content = `${options.hashPrefix + request} + ${unescape(localName)}`;
    localIdentName = localIdentName.replace(/\[local\]/gi, localName);
    const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
    const ret = hash.replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '@').replace(/^((-?[0-9])|--)/, '_$1');
    // /^(node_modules|_+)/
    if (!/^node_modules/.test(ret))
        return ret.replace(/@/g, '-');
    const arr = ret.split('@');
    arr.shift();
    // const moduleName = arr[0]
    /* @todo module alias */
    return '~' + arr.join('-');
}
function createStyleConfig({ globals, cssvar }) {
    const test = /s?css$/;
    return {
        module: {
            rules: [{
                    test,
                    include: globals,
                    use: createGlobalStyleUses()
                }, {
                    test,
                    exclude: globals,
                    use: createModuleStyleUses()
                }, {
                    test: cssvar,
                    type: 'javascript/auto',
                    use: makeRootCssVariableRules()
                }]
        }
    };
}
exports.default = createStyleConfig;
//# sourceMappingURL=style-config.js.map