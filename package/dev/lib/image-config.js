"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waya_core_1 = require("waya-core");
function createImageConfig({}) {
    return {
        module: {
            rules: [{
                    test: /\.(jpe?g|png|gif|svg|webp)$/,
                    use: [
                        waya_core_1.createLoaderUse("url" /* Url */)
                    ]
                }]
        }
    };
}
exports.default = createImageConfig;
//# sourceMappingURL=image-config.js.map