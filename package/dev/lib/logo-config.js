"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waya_core_1 = require("waya-core");
function createLogoConfig({ logo }) {
    return {
        module: {
            rules: [{
                    test: logo,
                    use: waya_core_1.createLoaderUse("url" /* Url */)
                }]
        }
    };
}
exports.default = createLogoConfig;
//# sourceMappingURL=logo-config.js.map