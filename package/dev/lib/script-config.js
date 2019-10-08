"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const waya_core_1 = require("waya-core");
const TSConfig = path.join(__dirname, 'default-tsconfig.json');
function createScriptConfig({ context }) {
    return {
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    use: [
                        waya_core_1.createLoaderUse("ts" /* TS */, {
                            context,
                            transpileOnly: true,
                            configFile: TSConfig,
                            getCustomTransformers: (program) => {
                                return {
                                    before: [
                                        waya_core_1.transformImportFactory(`react`, `React`),
                                    ],
                                    after: [
                                        waya_core_1.transformReactMemo(program.getTypeChecker())
                                    ]
                                };
                            }
                        })
                    ]
                }]
        }
    };
}
exports.default = createScriptConfig;
//# sourceMappingURL=script-config.js.map